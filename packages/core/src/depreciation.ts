// ============ 折旧预测 ============
import type { UserProfile, KlinePoint } from './types';
import { calculateBV } from './formula';

export interface DepreciationPoint {
  age: number;
  bv: number;
  /** 当年折旧额（投入资本的自然损耗） */
  depreciation: number;
  /** 当年新增投入 */
  newInvest: number;
}

export interface DepreciationForecast {
  points: DepreciationPoint[];
  /** 5 年后的 BV 估算 */
  bv5y: number;
  /** 10 年后的 BV 估算 */
  bv10y: number;
  /** 年均折旧率 */
  annualDecayRate: number;
  /** 建议 */
  suggestions: string[];
}

/** 模拟未来 N 年的 BV 变化（含折旧与新增投入） */
export function forecastDepreciation(
  user: UserProfile,
  years = 10,
  annualInvest = 0,
): DepreciationForecast {
  const startAge = user.age;
  const points: DepreciationPoint[] = [];
  let bv = calculateBV(user);

  // 年折旧率：教育折旧快，技能次之，健康最稳
  // 简化：每年折旧当前 BV 的 5%-8%
  const annualDecayRate = 0.06;

  for (let i = 1; i <= years; i++) {
    const age = startAge + i;
    const depreciation = Math.round(bv * annualDecayRate);
    const newInvest = annualInvest;
    bv = bv - depreciation + newInvest;
    bv = Math.max(0, bv);
    points.push({ age, bv: Math.round(bv), depreciation, newInvest });
  }

  const bv5y = points[4]?.bv || 0;
  const bv10y = points[9]?.bv || 0;

  const suggestions: string[] = [];
  if (annualInvest === 0) {
    suggestions.push('未设定年度新增投入，成长值会随时间自然衰减');
  }
  if (bv10y < bv * 0.5) {
    suggestions.push('按当前节奏，10 年后成长积累可能缩水过半');
    suggestions.push('建议增加年度投入，或提升投入质量');
  }
  if (bv5y > bv) {
    suggestions.push('按当前投入节奏，5 年后成长积累仍在增长');
  }
  suggestions.push('健康与技能类投入折旧较慢，优先配置');

  return {
    points,
    bv5y,
    bv10y,
    annualDecayRate,
    suggestions,
  };
}
