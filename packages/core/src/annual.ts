// ============ 年报 ============
import type { UserProfile, KlinePoint } from './types';
import { calculateStock } from './formula';
import { MILESTONES } from './milestone';
import { countJournalsInDays, getAvgMood } from './journal';

export interface AnnualReport {
  year: number;
  /** 年初指数（估算） */
  startPrice: number;
  /** 当前指数 */
  endPrice: number;
  /** 年度变化 */
  changePoints: number;
  changePct: number;
  /** 年度投入 */
  totalInvest: number;
  investCount: number;
  /** 年度记录 */
  journalDays: number;
  avgMood: number | null;
  /** 里程碑 */
  milestoneCount: number;
  /** 年度关键词 */
  keywords: string[];
  /** 年度总结 */
  summary: string;
  /** 下年度方向 */
  nextYearPlan: string[];
}

/** 生成年度报告 */
export function generateAnnualReport(user: UserProfile, kline: KlinePoint[]): AnnualReport {
  const now = new Date();
  const year = now.getFullYear();
  const snap = calculateStock(user);

  // 年初指数：取一年前 kline 点
  const yearStart = now.getFullYear() - user.birthYear - 1;
  let startPrice = snap.price;
  const beforeYear = kline.filter((k) => k.age <= yearStart);
  if (beforeYear.length > 0) startPrice = beforeYear[beforeYear.length - 1].price;

  const changePoints = snap.price - startPrice;
  const changePct = startPrice > 0 ? (changePoints / startPrice) * 100 : 0;

  // 年度投入
  const yearStartTs = new Date(year, 0, 1).getTime();
  const yearInvests = (user.investments || []).filter((i) => new Date(i.date).getTime() >= yearStartTs);
  const totalInvest = yearInvests.reduce((s, i) => s + i.amount, 0);
  const investCount = yearInvests.length;

  const journalDays = countJournalsInDays(user, 365);
  const avgMood = getAvgMood(user, 365);

  const milestoneCount = MILESTONES.filter((m) => m.condition(user)).length;

  // 关键词
  const keywords: string[] = [];
  if (milestoneCount >= 5) keywords.push('🏆 里程碑丰收');
  if (investCount >= 12) keywords.push('💰 持续投入');
  if (journalDays >= 100) keywords.push('📝 勤于觉察');
  if (user.healthScore >= 75) keywords.push('💪 健康在线');
  if (snap.growthCoef >= 1.2) keywords.push('🚀 高速成长');
  if (keywords.length === 0) keywords.push('🌱 稳步积累');

  // 总结
  let summary: string;
  if (changePoints > 0) {
    summary = `这一年，你的人生指数上升了 ${Math.round(changePoints)} 点。每一笔投入、每一次觉察，都在累积成看得见的成长。`;
  } else if (changePoints < 0) {
    summary = `这一年有些起伏，指数回落了 ${Math.round(Math.abs(changePoints))} 点。回撤不是失败，是重新认识自己的机会。`;
  } else {
    summary = '这一年平稳度过，成长在潜移默化中发生。';
  }

  // 下年度方向
  const nextYearPlan: string[] = [];
  if (investCount < 12) nextYearPlan.push('每月至少记录一笔投入');
  if (journalDays < 50) nextYearPlan.push('每周记录 2-3 条成长感悟');
  if (user.healthScore < 70) nextYearPlan.push('提升健康评分到 70 以上');
  if (snap.growthCoef < 1.0) nextYearPlan.push('增加学习时长，提升成长系数');
  if (nextYearPlan.length === 0) nextYearPlan.push('保持当前节奏，设定更高的成长目标');

  return {
    year,
    startPrice: Math.round(startPrice),
    endPrice: Math.round(snap.price),
    changePoints: Math.round(changePoints),
    changePct: Math.round(changePct * 10) / 10,
    totalInvest,
    investCount,
    journalDays,
    avgMood,
    milestoneCount,
    keywords,
    summary,
    nextYearPlan,
  };
}
