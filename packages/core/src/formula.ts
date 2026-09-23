import type { UserProfile, StockSnapshot, InvestType } from './types';
import { Constants, MILESTONE_BONUS_CAP, GROWTH_COEF_MIN, GROWTH_COEF_MAX, QUALITY_COEF_MIN, QUALITY_COEF_MAX, RISK_DISCOUNT_MAX } from './constants';
import { MILESTONES } from './milestone';
import { calcSubjectiveAdjust } from './subjective';

// ============ 工具函数 ============

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ============ 置信度（B2） ============

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ConfidenceInfo {
  level: ConfidenceLevel;
  /** 估算成分占比（0~1）：历史投入中由模型估算的比例 */
  estimatedRatio: number;
  /** 手动录入投入笔数 */
  manualCount: number;
  /** 估算笔数 */
  estimatedCount: number;
  label: string;
  /** 校准后可达到的估算占比（激励用户校准） */
  potentialEstimatedRatio: number;
}

/**
 * 计算指数置信度
 * - 高置信：用户手动录入投入占比 ≥ 50%
 * - 中置信：手动录入占比 20%~50%，或仅靠画像估算
 * - 低置信：全部由默认值/模型推测
 */
export function calcConfidence(user: UserProfile): ConfidenceInfo {
  const historyCount = user.history?.length || 0;
  const manualCount = user.investments?.length || 0;
  const total = historyCount + manualCount;
  // 历史投入全部为估算；手动录入为高置信
  const estimatedCount = historyCount;
  const estimatedRatio = total > 0 ? estimatedCount / total : 1;

  let level: ConfidenceLevel;
  const manualRatio = total > 0 ? manualCount / total : 0;
  if (manualRatio >= 0.5) level = 'high';
  else if (manualRatio >= 0.2) level = 'medium';
  else level = 'low';

  const labelMap: Record<ConfidenceLevel, string> = {
    high: '高置信',
    medium: '中置信',
    low: '低置信',
  };

  // 校准后（假设用户录入当前年龄一笔真实投入）的估算占比
  const potentialEstimatedRatio = total > 0 ? estimatedCount / (total + 1) : 0.5;

  return {
    level,
    estimatedRatio: Math.round(estimatedRatio * 100) / 100,
    manualCount,
    estimatedCount,
    label: labelMap[level],
    potentialEstimatedRatio: Math.round(potentialEstimatedRatio * 100) / 100,
  };
}

// ============ 折旧计算 ============

/**
 * 计算投入经过 years 年后的折旧后价值
 * 学历（education）不折旧，其余按半衰期指数衰减
 */
export function decay(invest: number, years: number, type: InvestType): number {
  if (type === 'education') return invest;
  const halfLife = Constants.TYPE_HALF_LIFE[type] || 5;
  if (!isFinite(halfLife)) return invest;
  return invest * Math.exp(-0.693 * years / halfLife);
}

// ============ 阶段系数（线性插值） ============

/**
 * 根据年龄获取阶段系数，节点间线性插值
 */
export function getStageCoef(age: number): number {
  const nodes = Constants.STAGE_COEF;
  if (age <= nodes[0].age) return nodes[0].coef;
  for (let i = 0; i < nodes.length - 1; i++) {
    if (age >= nodes[i].age && age <= nodes[i + 1].age) {
      const t = (age - nodes[i].age) / (nodes[i + 1].age - nodes[i].age);
      return nodes[i].coef + t * (nodes[i + 1].coef - nodes[i].coef);
    }
  }
  return nodes[nodes.length - 1].coef;
}

// ============ 成长系数（v1.2 定义） ============

/**
 * 成长系数 = clamp(1.0 + 收入增速贡献 + 学习时长贡献, 0.65, 1.5)
 * 收入增速贡献 = clamp(annualIncomeGrowth × 2, -0.35, 0.35)
 * 学习时长贡献 = clamp((studyHours - 5) / 20, -0.15, 0.15)
 */
export function calcGrowthCoef(user: UserProfile): number {
  const incomeContrib = clamp((user.annualIncomeGrowth || 0) * 2, -0.35, 0.35);
  const studyContrib = clamp(((user.studyHours || 0) - 5) / 20, -0.15, 0.15);
  return clamp(1.0 + incomeContrib + studyContrib, GROWTH_COEF_MIN, GROWTH_COEF_MAX);
}

// ============ 质量系数（v1.2 定义） ============

/**
 * 质量系数 = clamp(0.6 + (healthScore / 100) × 0.7, 0.6, 1.3)
 */
export function calcQualityCoef(effectiveHealth: number): number {
  return clamp(0.6 + (effectiveHealth / 100) * 0.7, QUALITY_COEF_MIN, QUALITY_COEF_MAX);
}

// ============ 风险折扣（v1.2 定义） ============

/**
 * 风险折扣 = clamp(debtRatio × 0.3, 0, 0.3)
 */
export function calcRiskDiscount(user: UserProfile): number {
  return clamp((user.debtRatio || 0) * 0.3, 0, RISK_DISCOUNT_MAX);
}

// ============ BV（累计成长资本，万元） ============

/**
 * 计算累计成长资本（万元）
 * BV = Σ (自我投入金额 ÷ 10000) × 类型权重 × 折旧系数 + 家庭支持资本
 *
 * 家庭支持资本：单独列项，不乘权重、不折旧
 */
export function calculateBV(user: UserProfile, now: Date = new Date()): number {
  let bv = 0;
  user.history.forEach((h) => {
    const years = user.age - h.age;
    const w = Constants.TYPE_WEIGHTS[h.type] || 1;
    bv += (h.invest / 10000) * w * decay(1, Math.max(0, years), h.type);
  });
  user.investments.forEach((inv) => {
    const years = (now.getTime() - inv.date.getTime()) / (365.25 * 24 * 3600 * 1000);
    const w = Constants.TYPE_WEIGHTS[inv.type] || 1;
    bv += (inv.amount / 10000) * w * decay(1, Math.max(0, years), inv.type);
  });
  // 家庭支持资本（万元）：不折旧、不乘权重
  if (user.familySupportCapital) {
    bv += user.familySupportCapital;
  }
  return bv;
}

// ============ 主计算函数 ============

/**
 * 计算人生指数及衍生指标
 *
 * 人生指数 = (100 + BV × 阶段系数 + min(里程碑加成, 200)) × 成长系数 × 质量系数 × (1 - 风险折扣) × 主观感知权重
 */
export function calculateStock(user: UserProfile, now: Date = new Date()): StockSnapshot {
  const bv = calculateBV(user, now);
  const stageCoef = getStageCoef(user.age);
  const milestoneRaw = MILESTONES.filter((m) => m.condition(user)).reduce((s, m) => s + m.bonus, 0);
  const milestoneBonus = Math.min(MILESTONE_BONUS_CAP, milestoneRaw); // v1.2 封顶 200
  const eps = (user.annualIncome || 0) / 10000;
  // ROE = EPS / (BV + 1)，BV>0 才展示并封顶 1000
  const roe = bv > 0 ? Math.min(1000, (eps / (bv + 1)) * 100) : 0;

  // 停滞衰减：最近2年无教育/技能/健康投入，成长系数打折（不进则退）
  const recentGrowthInvest = user.investments.filter((inv) => {
    const years = (now.getTime() - inv.date.getTime()) / (365.25 * 24 * 3600 * 1000);
    return years < 2 && ['education', 'skill', 'health'].includes(inv.type);
  });
  const stagnationPenalty =
    recentGrowthInvest.length > 0 ? 1 : Math.max(0.65, 1 - (user.age - 22) * 0.012);

  // 健康自然衰退：30岁后无健康投入，健康分逐年下降
  let effectiveHealth = user.healthScore || 50;
  const recentHealthInvest = user.investments.filter((inv) => {
    const years = (now.getTime() - inv.date.getTime()) / (365.25 * 24 * 3600 * 1000);
    return years < 2 && inv.type === 'health';
  });
  if (user.age > 30 && recentHealthInvest.length === 0) {
    effectiveHealth = Math.max(20, effectiveHealth - (user.age - 30) * 1.5);
  }

  const growthCoefBase = calcGrowthCoef(user);
  const growthCoef = growthCoefBase * stagnationPenalty;
  const qualityCoef = calcQualityCoef(effectiveHealth);
  const riskDiscount = calcRiskDiscount(user);
  const subjectiveAdjust = calcSubjectiveAdjust(user); // 用户驱动，默认 1.0

  const price =
    (Constants.BASE_INDEX + bv * stageCoef + milestoneBonus) * growthCoef * qualityCoef * (1 - riskDiscount) * subjectiveAdjust;
  const change = ((price - Constants.BASE_INDEX) / Constants.BASE_INDEX) * 100;
  // v1.2：EPS=0 时 PE 显示"—"，不显示 Infinity
  const pe = eps > 0 ? Math.round((price / eps) * 10) / 10 + '倍' : '—';

  return {
    price: Math.round(price * 10) / 10,
    change: Math.round(change * 10) / 10,
    bv: Math.round(bv * 10) / 10,
    eps: Math.round(eps * 100) / 100,
    roe: Math.round(roe * 10) / 10,
    pe,
    milestoneBonus,
    growthCoef: Math.round(growthCoef * 100) / 100,
    qualityCoef: Math.round(qualityCoef * 100) / 100,
    stagnationPenalty: Math.round(stagnationPenalty * 100) / 100,
    effectiveHealth: Math.round(effectiveHealth),
    riskDiscount: Math.round(riskDiscount * 100) / 100,
    subjectiveAdjust: Math.round(subjectiveAdjust * 100) / 100,
  };
}
