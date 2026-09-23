// ============ 挑战系统 ============
import type { UserProfile } from './types';
import { getJournalStreak } from './journal';
import { getWeeklyStatus } from './weekly';

export interface Challenge {
  id: string;
  name: string;
  icon: string;
  desc: string;
  /** 当前进度 */
  progress: number;
  /** 目标值 */
  target: number;
  /** 是否已完成 */
  done: boolean;
  /** 单位 */
  unit: string;
}

/** 获取当前挑战列表 */
export function getChallenges(user: UserProfile): Challenge[] {
  const journalStreak = getJournalStreak(user);
  const weekly = getWeeklyStatus(user);
  const investCount = (user.investments || []).length;
  const journalCount = (user.journals || []).length;
  const milestoneCount = (user as any)._milestones || 0;

  const challenges: Challenge[] = [
    {
      id: 'streak7',
      name: '七日觉察',
      icon: '🔥',
      desc: '连续 7 天记录成长感悟',
      progress: Math.min(journalStreak, 7),
      target: 7,
      done: journalStreak >= 7,
      unit: '天',
    },
    {
      id: 'streak30',
      name: '月度坚持',
      icon: '🌟',
      desc: '连续 30 天记录成长感悟',
      progress: Math.min(journalStreak, 30),
      target: 30,
      done: journalStreak >= 30,
      unit: '天',
    },
    {
      id: 'invest10',
      name: '十笔投入',
      icon: '💰',
      desc: '累计记录 10 笔自我投入',
      progress: Math.min(investCount, 10),
      target: 10,
      done: investCount >= 10,
      unit: '笔',
    },
    {
      id: 'weekly4',
      name: '周周不断',
      icon: '📅',
      desc: '连续 4 周每周至少一笔投入',
      progress: Math.min(weekly.streakWeeks, 4),
      target: 4,
      done: weekly.streakWeeks >= 4,
      unit: '周',
    },
    {
      id: 'journal50',
      name: '觉察达人',
      icon: '📝',
      desc: '累计记录 50 条成长感悟',
      progress: Math.min(journalCount, 50),
      target: 50,
      done: journalCount >= 50,
      unit: '条',
    },
    {
      id: 'milestone5',
      name: '里程碑收集者',
      icon: '🏆',
      desc: '达成 5 个成长里程碑',
      progress: Math.min(milestoneCount, 5),
      target: 5,
      done: milestoneCount >= 5,
      unit: '个',
    },
  ];

  return challenges;
}

/** 计算挑战完成率 */
export function getChallengeCompletion(user: UserProfile): number {
  const challenges = getChallenges(user);
  const done = challenges.filter((c) => c.done).length;
  return Math.round((done / challenges.length) * 100);
}
