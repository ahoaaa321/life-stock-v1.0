// ============ 一句话成长记录 ============
import type { JournalEntry, UserProfile, InvestType } from './types';

export type JournalMood = 'great' | 'good' | 'ok' | 'low';
export type JournalCategory = InvestType | 'reflection' | 'gratitude';

const MOOD_SCORE: Record<JournalMood, number> = {
  great: 4, good: 3, ok: 2, low: 1,
};

/** 创建一条记录 */
export function createJournal(
  content: string,
  mood?: JournalMood,
  category?: JournalCategory,
): JournalEntry {
  return {
    id: `j_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    date: new Date(),
    content: content.trim(),
    mood,
    category,
  };
}

/** 添加记录到用户资料 */
export function addJournal(user: UserProfile, entry: JournalEntry): UserProfile {
  return { ...user, journals: [...(user.journals || []), entry] };
}

/** 获取最近 N 条记录 */
export function getRecentJournals(user: UserProfile, n = 10): JournalEntry[] {
  return [...(user.journals || [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n);
}

/** 统计最近 N 天的记录数量 */
export function countJournalsInDays(user: UserProfile, days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return (user.journals || []).filter((j) => new Date(j.date).getTime() >= cutoff).length;
}

/** 计算连续记录天数（从今天往前数） */
export function getJournalStreak(user: UserProfile): number {
  const dates = new Set(
    (user.journals || []).map((j) => new Date(j.date).toDateString()),
  );
  let streak = 0;
  const d = new Date();
  while (dates.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** 计算最近 N 天的平均情绪分（1-4），无记录返回 null */
export function getAvgMood(user: UserProfile, days = 30): number | null {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = (user.journals || []).filter(
    (j) => j.mood && new Date(j.date).getTime() >= cutoff,
  );
  if (recent.length === 0) return null;
  const sum = recent.reduce((s, j) => s + MOOD_SCORE[j.mood!], 0);
  return sum / recent.length;
}
