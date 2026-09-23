// ============ 目标反推 ============
import type { UserProfile, StockSnapshot } from './types';
import { calculateStock } from './formula';

export interface GoalPlan {
  /** 目标指数 */
  target: number;
  /** 当前指数 */
  current: number;
  /** 差距 */
  gap: number;
  /** 达到目标所需的累计成长资本估算 */
  requiredBV: number;
  /** 还需追加投入估算（万元） */
  additionalInvest: number;
  /** 按当前节奏估算所需月数（区间） */
  monthsRange: [number, number];
  /** 建议（非承诺） */
  suggestions: string[];
  /** 置信度说明 */
  confidence: string;
}

/** 反推达到目标指数所需的投入 */
export function reverseGoal(user: UserProfile, target: number): GoalPlan {
  const snap: StockSnapshot = calculateStock(user);
  const current = snap.price;
  const gap = Math.max(0, target - current);

  // 反推所需 BV：price ≈ (100 + BV * stageCoef + bonus) * growth * quality * (1-risk) * subjective
  // => BV = (price / (growth*quality*(1-risk)*subjective) - 100 - bonus) / stageCoef
  const multiplier =
    snap.growthCoef * snap.qualityCoef * (1 - snap.riskDiscount) * snap.subjectiveAdjust;
  const stageCoef = (snap as any).stageCoef || 1;
  const targetBV = Math.max(
    0,
    (target / multiplier - 100 - snap.milestoneBonus) / stageCoef,
  );

  const currentBV = snap.bv;
  const requiredBV = Math.max(0, targetBV - currentBV);
  // BV 与投入的粗略换算：投入约 1 万元对应 BV 约 1（取保守区间）
  const additionalInvest = requiredBV;

  // 按月度投入节奏估算（假设每月投入为年收入的 5%-15%）
  const monthlyInvestLow = (user.annualIncome * 0.05) / 12;
  const monthlyInvestHigh = (user.annualIncome * 0.15) / 12;
  const monthsLow = monthlyInvestHigh > 0 ? Math.ceil(requiredBV / monthlyInvestHigh) : 999;
  const monthsHigh = monthlyInvestLow > 0 ? Math.ceil(requiredBV / monthlyInvestLow) : 999;

  const suggestions: string[] = [];
  if (gap <= 0) {
    suggestions.push('已达到目标，可设定更高的成长目标');
  } else {
    suggestions.push(`距离目标还差 ${Math.round(gap)} 点`);
    suggestions.push(`按当前节奏约需 ${monthsLow}-${monthsHigh} 个月（仅作参考）`);
    suggestions.push('提升学习时长与健康评分，可加速成长系数');
    suggestions.push('达成更多里程碑可获得额外加成');
  }

  return {
    target,
    current: Math.round(current),
    gap: Math.round(gap),
    requiredBV: Math.round(targetBV),
    additionalInvest: Math.round(additionalInvest),
    monthsRange: [Math.min(monthsLow, 999), Math.min(monthsHigh, 999)],
    suggestions,
    confidence: '估算基于当前系数与线性假设，实际成长受多因素影响，请理性参考',
  };
}
