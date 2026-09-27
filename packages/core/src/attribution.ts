import type { UserProfile, StockSnapshot } from './types';
import { getStageCoef } from './formula';

/** 归因项：每个因子对最终指数的贡献（绝对值与占比） */
export interface AttributionItem {
  key: string;
  name: string;
  /** 该因子贡献的绝对指数点数 */
  contribution: number;
  /** 占最终指数的百分比（0~1） */
  ratio: number;
  /** 一句话解释"为什么是这个数" */
  reason: string;
}

/**
 * 归因分析：拆解最终指数由哪些因子贡献
 *
 * 公式：price = (100 + BV×stageCoef + milestoneBonus) × growthCoef × qualityCoef × (1-riskDiscount) × subjectiveAdjust
 *
 * 归因方法：
 * - 基数贡献 = 100 × 其他系数乘积
 * - BV贡献 = BV×stageCoef × 其他系数乘积
 * - 里程碑贡献 = milestoneBonus × 其他系数乘积
 * - 成长/质量/风险/主观作为倍率，体现在"放大效应"上
 *
 * 所有数值均可复现，不硬编码、不取模。
 */
export function calcAttribution(user: UserProfile, stock: StockSnapshot): AttributionItem[] {
  const stageCoef = getStageCoef(user.age);
  const base = 100;
  const bvTerm = stock.bv * stageCoef;
  const milestone = stock.milestoneBonus;
  const preMultiplier = base + bvTerm + milestone; // 乘法前的基数

  // 各倍率
  const multipliers = [
    { key: 'growth', name: '成长系数', value: stock.growthCoef, reason: `收入增速与学习时长决定，含停滞衰减 ${stock.stagnationPenalty}` },
    { key: 'quality', name: '质量系数', value: stock.qualityCoef, reason: `基于有效健康分 ${stock.effectiveHealth}` },
    { key: 'risk', name: '风险折扣', value: 1 - stock.riskDiscount, reason: `负债率 ${(user.debtRatio || 0) * 100}%，折扣 ${(stock.riskDiscount * 100).toFixed(0)}%` },
    { key: 'subjective', name: '主观感知', value: stock.subjectiveAdjust, reason: `你设定的主观权重 ${stock.subjectiveAdjust.toFixed(2)}（1.0 为中性）` },
  ];

  const totalMultiplier = multipliers.reduce((s, m) => s * m.value, 1);
  const price = stock.price;

  const items: AttributionItem[] = [];

  // 基数部分贡献
  items.push({
    key: 'base',
    name: '基准指数',
    contribution: Math.round(base * totalMultiplier * 10) / 10,
    ratio: price > 0 ? (base * totalMultiplier) / price : 0,
    reason: '所有人同一起点 100 分',
  });

  // BV 贡献
  items.push({
    key: 'bv',
    name: '累计成长值',
    contribution: Math.round(bvTerm * totalMultiplier * 10) / 10,
    ratio: price > 0 ? (bvTerm * totalMultiplier) / price : 0,
    reason: `成长值 ${stock.bv} 点 × 阶段系数 ${stageCoef.toFixed(2)}（${user.age}岁）`,
  });

  // 里程碑贡献
  items.push({
    key: 'milestone',
    name: '里程碑加成',
    contribution: Math.round(milestone * totalMultiplier * 10) / 10,
    ratio: price > 0 ? (milestone * totalMultiplier) / price : 0,
    reason: `已达成里程碑加分（封顶 200）`,
  });

  // 各倍率的"放大效应"：展示为对基数的放大倍数
  multipliers.forEach((m) => {
    items.push({
      key: m.key,
      name: m.name,
      contribution: 0, // 倍率不直接贡献点数，而是放大
      ratio: 0,
      reason: m.reason + `（×${m.value.toFixed(2)}）`,
    });
  });

  return items;
}

/**
 * 计算"最大正向贡献因子"用于归因摘要
 */
export function getTopContributor(items: AttributionItem[]): AttributionItem | null {
  const withContribution = items.filter((i) => i.contribution > 0);
  if (withContribution.length === 0) return null;
  return withContribution.reduce((a, b) => (a.contribution > b.contribution ? a : b));
}
