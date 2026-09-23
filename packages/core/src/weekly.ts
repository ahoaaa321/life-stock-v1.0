// ============ 每周一笔激励 ============
import type { UserProfile } from './types';

export interface WeeklyStatus {
  /** 本周是否已有投入 */
  investedThisWeek: boolean;
  /** 本周投入笔数 */
  countThisWeek: number;
  /** 连续记录周数 */
  streakWeeks: number;
  /** 本周剩余天数 */
  daysLeftInWeek: number;
  /** 激励文案 */
  message: string;
}

/** 获取周几（0=周日） */
function getWeekStart(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 周一为一周开始
  const start = new Date(d);
  start.setDate(d.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

/** 检查每周一笔状态 */
export function getWeeklyStatus(user: UserProfile): WeeklyStatus {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  const weekInvests = (user.investments || []).filter(
    (i) => {
      const t = new Date(i.date).getTime();
      return t >= weekStart.getTime() && t < weekEnd.getTime();
    },
  );

  const countThisWeek = weekInvests.length;
  const investedThisWeek = countThisWeek > 0;

  // 计算连续周数
  let streakWeeks = 0;
  let cursor = new Date(now);
  while (true) {
    const ws = getWeekStart(cursor);
    const we = new Date(ws);
    we.setDate(ws.getDate() + 7);
    const hasInvest = (user.investments || []).some(
      (i) => {
        const t = new Date(i.date).getTime();
        return t >= ws.getTime() && t < we.getTime();
      },
    );
    if (hasInvest) {
      streakWeeks++;
      cursor = new Date(ws);
      cursor.setDate(ws.getDate() - 1);
    } else {
      // 如果当前周还没结束且没投入，不算断
      if (streakWeeks === 0 && cursor.getTime() === now.getTime()) {
        cursor = new Date(ws);
        cursor.setDate(ws.getDate() - 1);
        continue;
      }
      break;
    }
    if (streakWeeks > 520) break; // 安全上限
  }

  const daysLeftInWeek = Math.max(0, 7 - (now.getDay() === 0 ? 7 : now.getDay() - 1));

  let message: string;
  if (investedThisWeek) {
    message = `本周已记录 ${countThisWeek} 笔，继续保持！连续 ${streakWeeks} 周`;
  } else if (daysLeftInWeek <= 2) {
    message = `本周还剩 ${daysLeftInWeek} 天，记一笔投入保持连续吧`;
  } else {
    message = `本周还剩 ${daysLeftInWeek} 天，期待你的第一笔投入`;
  }

  return {
    investedThisWeek,
    countThisWeek,
    streakWeeks,
    daysLeftInWeek,
    message,
  };
}
