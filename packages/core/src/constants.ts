import type { InvestType, Region, Area, IncomeLevel } from './types';

// ============ 常量配置 ============

/** 公式版本号：每次修改参数需升级，旧数据保留原版本计算结果 */
export const FORMULA_VERSION = '1.2';

/** 里程碑加成上限 */
export const MILESTONE_BONUS_CAP = 200;

/** 成长系数范围 */
export const GROWTH_COEF_MIN = 0.65;
export const GROWTH_COEF_MAX = 1.5;

/** 质量系数范围 */
export const QUALITY_COEF_MIN = 0.6;
export const QUALITY_COEF_MAX = 1.3;

/** 风险折扣上限 */
export const RISK_DISCOUNT_MAX = 0.3;

export const Constants = {
  /** 基准指数，所有人同一起点 */
  BASE_INDEX: 100,

  /** 投入类型权重 */
  TYPE_WEIGHTS: {
    education: 1.5,
    skill: 1.3,
    health: 1.1,
    network: 1.0,
    entertainment: 0.5,
    other: 0.5,
  } as Record<InvestType, number>,

  /** 投入类型半衰期（年），Infinity 表示不折旧 */
  TYPE_HALF_LIFE: {
    education: Infinity,
    skill: 5,
    health: 4,
    network: 3,
    entertainment: 1,
    other: 2,
  } as Record<InvestType, number>,

  /** 地区系数 */
  REGION_COEF: {
    tier1: 1.8,
    new_tier1: 1.4,
    tier2: 1.1,
    tier3: 0.8,
  } as Record<Region, number>,

  /** 城乡系数 */
  AREA_COEF: {
    urban: 1.0,
    rural: 0.68,
  } as Record<Area, number>,

  /** 家庭收入系数 */
  INCOME_COEF: {
    low: 0.35,
    below_avg: 0.65,
    avg: 1.0,
    above_avg: 1.55,
    high: 2.9,
  } as Record<IncomeLevel, number>,

  /** 阶段系数节点（年龄→系数），节点间线性插值 */
  STAGE_COEF: [
    { age: 0, coef: 0.2 },
    { age: 6, coef: 0.3 },
    { age: 12, coef: 0.5 },
    { age: 18, coef: 0.9 },
    { age: 25, coef: 1.1 },
    { age: 35, coef: 1.5 },
    { age: 50, coef: 1.3 },
    { age: 65, coef: 1.0 }, // v1.2 新增：退休后下降
    { age: 80, coef: 0.8 },
  ],

  /** 各年龄段年均教育投入（元），基于统计估算 */
  AGE_SPEND: {
    '0-2': 24538,
    '3-5': 36538,
    '6-14': 27007,
    '15-17': 29007,
    '18-22': 29135,
  } as Record<string, number>,

  /**
   * 各年龄段年均教育投入参考区间（元）：下限 ~ 中位 ~ 上限
   * 用于替代"±4%精度"，向用户展示估算范围而非虚假精度
   */
  AGE_SPEND_RANGE: {
    '0-2': { low: 18000, mid: 24538, high: 35000 },
    '3-5': { low: 25000, mid: 36538, high: 52000 },
    '6-14': { low: 18000, mid: 27007, high: 40000 },
    '15-17': { low: 20000, mid: 29007, high: 42000 },
    '18-22': { low: 18000, mid: 29135, high: 45000 },
  } as Record<string, { low: number; mid: number; high: number }>,
};

// ============ 数据来源（A4：可溯源，不编造年份） ============

export interface DataSource {
  name: string;
  year: string; // 不确定标注"待核实"
  caliber: string; // 原始口径
  note: string;
}

/** 估算数据来源清单，每个估算数字可溯源至此 */
export const DATA_SOURCES: Record<string, DataSource> = {
  education_cost: {
    name: '育娲人口研究《中国生育成本报告》',
    year: '2022',
    caliber: '全国家庭 0-17 岁子女年均教育/养育投入',
    note: '按地区、城乡、家庭收入分层调整；具体年份以报告最新版为准',
  },
  education_invest: {
    name: '中国儿童中心 家庭教育投入报告',
    year: '2025（待核实）',
    caliber: '城镇家庭各教育阶段年均教育支出',
    note: '数据年份待核实，使用前请查阅最新版报告',
  },
  ciefr: {
    name: '北大 CIEFR-HS 调查',
    year: '待核实',
    caliber: '中国家庭追踪调查中教育/健康支出模块',
    note: '公开数据年份待核实，仅供模型参数参考',
  },
};
