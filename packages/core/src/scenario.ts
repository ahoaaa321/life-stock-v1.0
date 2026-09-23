// ============ 情景模拟 ============
import type { UserProfile, StockSnapshot } from './types';
import { calculateStock } from './formula';

export type Scenario = 'optimistic' | 'neutral' | 'pessimistic';

export interface ScenarioResult {
  scenario: Scenario;
  label: string;
  icon: string;
  /** 该情景下的指数 */
  price: number;
  /** 相对当前的变化 */
  changePct: number;
  /** 情景描述 */
  desc: string;
  /** 关键参数 */
  params: { studyHours: number; healthScore: number; incomeGrowth: number; debtRatio: number };
}

/** 模拟不同情景下的指数 */
export function simulateScenarios(user: UserProfile): ScenarioResult[] {
  const current = calculateStock(user).price;

  const configs: { scenario: Scenario; label: string; icon: string; desc: string; mod: Partial<UserProfile> }[] = [
    {
      scenario: 'optimistic', label: '乐观', icon: '🚀',
      desc: '学习时长增加、健康改善、收入增长提速',
      mod: { studyHours: user.studyHours + 5, healthScore: Math.min(100, user.healthScore + 15), annualIncomeGrowth: user.annualIncomeGrowth + 0.05, debtRatio: Math.max(0, user.debtRatio - 0.1) },
    },
    {
      scenario: 'neutral', label: '中性', icon: '➡️',
      desc: '保持当前节奏不变',
      mod: {},
    },
    {
      scenario: 'pessimistic', label: '保守', icon: '🛡️',
      desc: '学习时长减少、健康下滑、收入停滞',
      mod: { studyHours: Math.max(0, user.studyHours - 3), healthScore: Math.max(0, user.healthScore - 15), annualIncomeGrowth: Math.max(0, user.annualIncomeGrowth - 0.05), debtRatio: Math.min(1, user.debtRatio + 0.1) },
    },
  ];

  return configs.map((c) => {
    const merged = { ...user, ...c.mod };
    const snap: StockSnapshot = calculateStock(merged);
    return {
      scenario: c.scenario,
      label: c.label,
      icon: c.icon,
      price: Math.round(snap.price),
      changePct: current > 0 ? Math.round(((snap.price - current) / current) * 1000) / 10 : 0,
      desc: c.desc,
      params: {
        studyHours: merged.studyHours,
        healthScore: merged.healthScore,
        incomeGrowth: merged.annualIncomeGrowth,
        debtRatio: merged.debtRatio,
      },
    };
  });
}
