// ============ 习惯打卡系统（纯函数，无 DOM 依赖） ============
import type { UserProfile, Habit, HabitCheck } from './types';

/** 本地时区 yyyy-MM-dd（不用 UTC，避免跨日错位） */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(now: Date = new Date()): string {
  return dayKey(now);
}

/** 解析 yyyy-MM-dd 为本地 Date（零点） */
export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

let seq = 0;
function uid(prefix: string): string {
  seq = (seq + 1) % 1e6;
  return `${prefix}_${Date.now().toString(36)}_${seq}${Math.random().toString(36).slice(2, 6)}`;
}

export interface HabitInput {
  name: string;
  icon: string;
  color: string;
  cadence: 'daily' | 'weekly';
  timesPerWeek?: number;
  linkedType?: string;
  investOnCheck?: boolean;
}

export function createHabit(input: HabitInput, now: Date = new Date()): Habit {
  const name = input.name.trim();
  if (!name) throw new Error('习惯名称不能为空');
  return {
    id: uid('h'),
    name,
    icon: input.icon || '⭐',
    color: input.color || '#ff8a4c',
    cadence: input.cadence,
    timesPerWeek: input.cadence === 'weekly'
      ? Math.min(7, Math.max(1, input.timesPerWeek || 3))
      : 1,
    linkedType: input.linkedType,
    investOnCheck: input.investOnCheck ?? true,
    createdAt: now,
  };
}

/** 取某习惯的全部打卡日期集合 */
export function getCheckSet(user: UserProfile, habitId: string): Set<string> {
  return new Set(
    (user.habitChecks || []).filter((c) => c.habitId === habitId).map((c) => c.date),
  );
}

export function isCheckedOn(user: UserProfile, habitId: string, key: string): boolean {
  return getCheckSet(user, habitId).has(key);
}

function findCheckIdx(checks: HabitCheck[], habitId: string, key: string): number {
  return checks.findIndex((c) => c.habitId === habitId && c.date === key);
}

/**
 * 切换某天打卡状态。
 * @param key 指定日期（本地 yyyy-MM-dd），默认今天
 * @returns 新的 user（不可变）与本次动作（checked/unchecked）
 */
export function toggleCheck(
  user: UserProfile,
  habitId: string,
  key: string = todayKey(),
  now: Date = new Date(),
): { user: UserProfile; action: 'checked' | 'unchecked'; makeup: boolean } {
  const checks = [...(user.habitChecks || [])];
  const idx = findCheckIdx(checks, habitId, key);
  let action: 'checked' | 'unchecked';
  let makeup = false;
  if (idx >= 0) {
    checks.splice(idx, 1);
    action = 'unchecked';
  } else {
    makeup = key < todayKey(now);
    checks.push({ habitId, date: key, makeup: makeup || undefined });
    action = 'checked';
  }
  return { user: { ...user, habitChecks: checks }, action, makeup };
}

/** 该习惯是否今天已打卡 */
export function isDoneToday(user: UserProfile, habit: Habit, now: Date = new Date()): boolean {
  return getCheckSet(user, habit.id).has(todayKey(now));
}

/** 两个 key 相差天数（a-b） */
function diffDays(a: string, b: string): number {
  return Math.round((parseKey(a).getTime() - parseKey(b).getTime()) / 86400000);
}

/**
 * 连续打卡统计：
 * - daily：从今天（或本周）向前连续有打卡的天数；
 * - weekly：本周达标则含本周，否则从上周起算，向前连续达标周数。
 */
export function getStreak(
  checkSet: Set<string>,
  habit: Habit,
  now: Date = new Date(),
): number {
  if (habit.cadence === 'daily') {
    let streak = 0;
    const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    while (checkSet.has(dayKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
  // weekly：周一为一周起点
  const cur = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = (cur.getDay() + 6) % 7; // 周一=0
  const thisMonday = new Date(cur);
  thisMonday.setDate(cur.getDate() - dow);
  let weekStart = thisMonday;
  // 本周尚未达标则从上周起算
  if (!weekMet(checkSet, weekStart, habit.timesPerWeek)) {
    weekStart = new Date(thisMonday);
    weekStart.setDate(thisMonday.getDate() - 7);
  }
  let streak = 0;
  while (weekMet(checkSet, weekStart, habit.timesPerWeek)) {
    streak++;
    weekStart = new Date(weekStart);
    weekStart.setDate(weekStart.getDate() - 7);
  }
  return streak;
}

/** 某周一所在周是否打卡达 N 次（未来日不计入基数） */
function weekMet(checkSet: Set<string>, monday: Date, target: number, now: Date = new Date()): boolean {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (d.getTime() > now.getTime()) continue;
    if (checkSet.has(dayKey(d))) count++;
  }
  return count >= target;
}

/** 历史最佳连续纪录（逐日扫描，周频按达标周计） */
export function getBestStreak(
  checkSet: Set<string>,
  habit: Habit,
  now: Date = new Date(),
): number {
  const keys = Array.from(checkSet).sort();
  if (keys.length === 0) return 0;
  if (habit.cadence === 'daily') {
    let best = 1;
    let cur = 1;
    for (let i = 1; i < keys.length; i++) {
      if (diffDays(keys[i], keys[i - 1]) === 1) {
        cur++;
        best = Math.max(best, cur);
      } else {
        cur = 1;
      }
    }
    return best;
  }
  // 周频：按达标周连续统计（含未来未结束周时不影响最佳）
  const first = parseKey(keys[0]);
  const firstDow = (first.getDay() + 6) % 7;
  const firstMonday = new Date(first);
  firstMonday.setDate(first.getDate() - firstDow);
  const last = parseKey(keys[keys.length - 1]);
  let best = 0;
  let cur = 0;
  const cursor = new Date(firstMonday);
  // 多扫一周到 last 之后
  while (cursor.getTime() <= last.getTime() + 7 * 86400000) {
    if (weekMet(checkSet, cursor, habit.timesPerWeek, now)) {
      cur++;
      best = Math.max(best, cur);
    } else {
      cur = 0;
    }
    cursor.setDate(cursor.getDate() + 7);
  }
  return best;
}

export interface HabitStatus {
  doneToday: boolean;
  streak: number;
  bestStreak: number;
  /** 本周（周一至今）打卡次数 */
  weekCount: number;
  /** 本周圆点：周一到周日 7 个布尔（未来日为 false） */
  weekDots: boolean[];
  /** 周频目标（日频恒为 1，周内每天 1 次） */
  weekTarget: number;
}

export function getHabitStatus(user: UserProfile, habit: Habit, now: Date = new Date()): HabitStatus {
  const set = getCheckSet(user, habit.id);
  const cur = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = (cur.getDay() + 6) % 7;
  const monday = new Date(cur);
  monday.setDate(cur.getDate() - dow);
  const weekDots: boolean[] = [];
  let weekCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const hit = d.getTime() <= cur.getTime() && set.has(dayKey(d));
    weekDots.push(hit);
    if (hit) weekCount++;
  }
  return {
    doneToday: set.has(dayKey(cur)),
    streak: getStreak(set, habit, now),
    bestStreak: getBestStreak(set, habit, now),
    weekCount,
    weekDots,
    weekTarget: habit.cadence === 'weekly' ? habit.timesPerWeek : 7,
  };
}

export interface HeatmapDay {
  date: string;
  checked: boolean;
  makeup: boolean;
  future: boolean;
}

/**
 * 近 N 周热力图（GitHub 风格），按周分组，每周 7 天（周一~周日）。
 * 最后一天为今天所在周的周日。
 */
export function getHeatmap(user: UserProfile, habit: Habit, weeks = 12, now: Date = new Date()): HeatmapDay[][] {
  const raw = new Map<string, HabitCheck>();
  (user.habitChecks || []).filter((c) => c.habitId === habit.id)
    .forEach((c) => raw.set(c.date, c));
  const cur = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = (cur.getDay() + 6) % 7;
  const thisMonday = new Date(cur);
  thisMonday.setDate(cur.getDate() - dow);
  const startMonday = new Date(thisMonday);
  startMonday.setDate(thisMonday.getDate() - 7 * (weeks - 1));
  const todayK = dayKey(cur);
  const result: HeatmapDay[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: HeatmapDay[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startMonday);
      d.setDate(startMonday.getDate() + w * 7 + i);
      const key = dayKey(d);
      const check = raw.get(key);
      week.push({
        date: key,
        checked: !!check,
        makeup: !!check?.makeup,
        future: key > todayK,
      });
    }
    result.push(week);
  }
  return result;
}
