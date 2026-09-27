// ============ 月度成长报告 ============
import type { UserProfile, KlinePoint } from './types';
import { calculateStock } from './formula';
import { countJournalsInDays, getAvgMood } from './journal';

export interface MonthlyReport {
  /** 报告月份（YYYY-MM） */
  month: string;
  /** 月初指数 */
  startPrice: number;
  /** 当前指数 */
  endPrice: number;
  /** 本月变化点数 */
  changePoints: number;
  /** 本月变化百分比 */
  changePct: number;
  /** 本月投入笔数 */
  investCount: number;
  /** 本月投入金额 */
  investAmount: number;
  /** 本月记录天数 */
  journalDays: number;
  /** 平均情绪分（1-4，null 表示无数据） */
  avgMood: number | null;
  /** 关键事件 */
  highlights: string[];
  /** 下月建议 */
  suggestions: string[];
}

/** 生成月报 */
export function generateMonthlyReport(
  user: UserProfile,
  kline: KlinePoint[],
): MonthlyReport {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const snap = calculateStock(user);
  const endPrice = snap.price;

  // 月初指数：取 kline 中最接近月初年龄的点
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthAge = now.getFullYear() - user.birthYear - (now.getMonth() < startOfMonth.getMonth() ? 1 : 0);
  let startPrice = endPrice;
  if (kline.length > 0) {
    // 取本月前的最后一个点作为月初近似
    const beforeMonth = kline.filter((k) => k.age <= monthAge - 0.08);
    if (beforeMonth.length > 0) {
      startPrice = beforeMonth[beforeMonth.length - 1].price;
    } else {
      startPrice = kline[0].price;
    }
  }

  const changePoints = endPrice - startPrice;
  const changePct = startPrice > 0 ? (changePoints / startPrice) * 100 : 0;

  // 本月投入
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthInvests = (user.investments || []).filter(
    (i) => new Date(i.date).getTime() >= monthStart,
  );
  const investCount = monthInvests.length;
  const investAmount = monthInvests.reduce((s, i) => s + i.amount, 0);

  // 记录天数
  const journalDays = countJournalsInDays(user, 30);
  const avgMood = getAvgMood(user, 30);

  // 关键事件
  const highlights: string[] = [];
  if (investCount > 0) {
    highlights.push(`本月记录了 ${investCount} 笔自我投入`);
  }
  if (changePoints > 0) {
    highlights.push(`成长指数上升 ${Math.round(changePoints)} 点`);
  } else if (changePoints < 0) {
    highlights.push('本月指数有所回落，可查看回落复盘');
  }
  const milestones = (user as any)._milestones || [];
  if (milestones > 0) {
    highlights.push(`达成 ${milestones} 个里程碑`);
  }

  // 下月建议
  const suggestions: string[] = [];
  if (investCount === 0) {
    suggestions.push('建议每周至少记录一笔投入，保持成长节奏');
  }
  if (journalDays < 5) {
    suggestions.push('增加一句话记录的频率，帮助觉察成长');
  }
  if (avgMood !== null && avgMood < 2.5) {
    suggestions.push('近期情绪偏低，关注健康与休息');
  }
  if (suggestions.length === 0) {
    suggestions.push('保持当前节奏，继续积累成长值');
  }

  return {
    month,
    startPrice: Math.round(startPrice),
    endPrice: Math.round(endPrice),
    changePoints: Math.round(changePoints),
    changePct: Math.round(changePct * 10) / 10,
    investCount,
    investAmount,
    journalDays,
    avgMood,
    highlights,
    suggestions,
  };
}
