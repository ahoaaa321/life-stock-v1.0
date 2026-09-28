// ============ 成长大事记时间线 ============
import type { UserProfile, LifeEvent, Investment, JournalEntry, Setback } from './types';
import { MILESTONES } from './milestone';
import { TYPE_META } from './analytics';
import type { InvestType } from './types';

let seq = 0;
function uid(): string {
  seq = (seq + 1) % 1e6;
  return `e_${Date.now().toString(36)}_${seq}${Math.random().toString(36).slice(2, 6)}`;
}

export interface ManualEventInput {
  icon?: string;
  title: string;
  desc?: string;
  date?: Date;
}

/** 添加一条手动大事件（不可变） */
export function addManualEvent(user: UserProfile, input: ManualEventInput): UserProfile {
  const title = input.title.trim();
  if (!title) throw new Error('事件标题不能为空');
  const event: LifeEvent = {
    id: uid(),
    date: input.date || new Date(),
    icon: input.icon || '🌟',
    title,
    desc: input.desc?.trim() || undefined,
    kind: 'manual',
  };
  return { ...user, lifeEvents: [...(user.lifeEvents || []), event] };
}

/** 添加一条系统事件（如连续打卡里程碑），kind=streak 不可删 */
export function addSystemEvent(user: UserProfile, input: ManualEventInput): UserProfile {
  const next = addManualEvent(user, input);
  const list = [...(next.lifeEvents || [])];
  list[list.length - 1] = { ...list[list.length - 1], kind: 'streak' };
  return { ...user, lifeEvents: list };
}

export function deleteEvent(user: UserProfile, id: string): UserProfile {
  return {
    ...user,
    lifeEvents: (user.lifeEvents || []).filter((e) => !(e.id === id && e.kind === 'manual')),
  };
}

export interface TimelineItem {
  id: string;
  date: Date;
  icon: string;
  title: string;
  desc?: string;
  /** manual 事件可删除 */
  deletable: boolean;
  source: 'invest' | 'journal' | 'setback' | 'manual' | 'streak';
}

export interface TimelineMonth {
  key: string;
  label: string;
  items: TimelineItem[];
}

export interface Timeline {
  months: TimelineMonth[];
  achievedMilestones: { icon: string; name: string; desc: string }[];
}

const SETBACK_META: Record<Setback['type'], { icon: string; name: string }> = {
  jobloss: { icon: '💼', name: '工作变动' },
  illness: { icon: '🏥', name: '健康风波' },
  loss: { icon: '🌧️', name: '失去与告别' },
  stagnate: { icon: '🪫', name: '停滞期' },
};

function invDisplay(inv: Investment): { icon: string; title: string } {
  const meta = TYPE_META[inv.type as InvestType];
  const icon = meta.icon;
  const title = inv.desc || `${meta.name}投入`;
  return { icon, title };
}

/**
 * 聚合时间线（按月分组、组内按日期倒序）：
 * 自动事件 = 投入、感悟、挫折；手动/系统事件来自 lifeEvents。
 * 已达成的里程碑作为置顶成就组（无日期数据，不伪造时间）。
 */
export function buildTimeline(user: UserProfile): Timeline {
  const items: TimelineItem[] = [];

  (user.investments || []).forEach((inv, i) => {
    const d = inv.date instanceof Date ? inv.date : new Date(inv.date as unknown as string);
    const disp = invDisplay(inv);
    items.push({
      id: `inv_${i}_${d.getTime()}`,
      date: d,
      icon: disp.icon,
      title: inv.amount > 0 ? `${disp.title} · ${inv.amount.toLocaleString()} 元` : disp.title,
      deletable: false,
      source: 'invest',
    });
  });

  (user.journals || []).forEach((j: JournalEntry, i) => {
    const d = j.date instanceof Date ? j.date : new Date(j.date as unknown as string);
    items.push({
      id: `jrn_${i}_${d.getTime()}`,
      date: d,
      icon: j.mood ? { great: '😄', good: '🙂', ok: '😐', low: '😔' }[j.mood] : '✨',
      title: j.content,
      deletable: false,
      source: 'journal',
    });
  });

  (user.setbacks || []).forEach((s, i) => {
    const d = s.date instanceof Date ? s.date : new Date(s.date as unknown as string);
    const meta = SETBACK_META[s.type];
    items.push({
      id: `sb_${i}_${d.getTime()}`,
      date: d,
      icon: meta.icon,
      title: `${meta.name}（影响 ${s.severity}%）`,
      deletable: false,
      source: 'setback',
    });
  });

  (user.lifeEvents || []).forEach((e) => {
    const d = e.date instanceof Date ? e.date : new Date(e.date as unknown as string);
    items.push({
      id: e.id,
      date: d,
      icon: e.icon,
      title: e.title,
      desc: e.desc,
      deletable: e.kind !== 'streak',
      source: (e.kind || 'manual') as 'manual' | 'streak',
    });
  });

  items.sort((a, b) => b.date.getTime() - a.date.getTime());

  const monthMap = new Map<string, TimelineItem[]>();
  for (const it of items) {
    const key = `${it.date.getFullYear()}-${String(it.date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMap.has(key)) monthMap.set(key, []);
    monthMap.get(key)!.push(it);
  }
  const months: TimelineMonth[] = Array.from(monthMap.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, list]) => {
      const [y, m] = key.split('-');
      return { key, label: `${y} 年 ${Number(m)} 月`, items: list };
    });

  const achievedMilestones = MILESTONES.filter((m) => m.condition(user))
    .map((m) => ({ icon: m.icon, name: m.name, desc: m.desc }));

  return { months, achievedMilestones };
}
