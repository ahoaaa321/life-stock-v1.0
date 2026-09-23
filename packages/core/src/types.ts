// ============ 类型定义（纯 TS，无平台依赖） ============

export type Region = 'tier1' | 'new_tier1' | 'tier2' | 'tier3';
export type Area = 'urban' | 'rural';
export type IncomeLevel = 'low' | 'below_avg' | 'avg' | 'above_avg' | 'high';
export type Education = 'primary' | 'junior' | 'senior' | 'college' | 'bachelor' | 'master';
export type InvestType = 'education' | 'skill' | 'health' | 'network' | 'entertainment' | 'other';

export interface HistoryItem {
  age: number;
  invest: number;
  type: InvestType;
}

export interface Investment {
  date: Date;
  amount: number;
  type: InvestType;
  desc?: string;
  /** 用户标记"对我影响很大"，仅用于展示高亮，不改变数值 */
  impact?: boolean;
}

export interface Setback {
  date: Date;
  type: 'jobloss' | 'illness' | 'loss' | 'stagnate';
  severity: number;
}

/** 一句话成长记录 */
export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood?: 'great' | 'good' | 'ok' | 'low';
  category?: InvestType | 'reflection' | 'gratitude';
}

export interface UserProfile {
  age: number;
  region: Region;
  area: Area;
  income: IncomeLevel;
  education: Education;
  birthYear: number;
  annualIncome: number;
  annualIncomeGrowth: number;
  studyHours: number;
  healthScore: number;
  debtRatio: number;
  hasJob: boolean;
  salaryRaised: boolean;
  hasLicense: boolean;
  marathon: boolean;
  married: boolean;
  hasHouse: boolean;
  hasChild: boolean;
  totalInvest: number;
  history: HistoryItem[];
  investments: Investment[];
  setbacks?: Setback[];
  journals?: JournalEntry[];
  /** 家庭支持资本（万元）：父母/家庭累计投入，不折旧、不乘权重，单独计入 BV */
  familySupportCapital?: number;
  /** 主观感知权重（0.5~1.5）：用户对自身成长价值的主观评估，默认 1.0 中性 */
  subjectiveWeight?: number;
  /** 数据版本号，用于公式升级迁移 */
  version?: string;
}

export interface StockSnapshot {
  price: number;
  change: number;
  bv: number;
  eps: number;
  roe: number;
  pe: string;
  milestoneBonus: number;
  growthCoef: number;
  qualityCoef: number;
  stagnationPenalty: number;
  effectiveHealth: number;
  riskDiscount: number;
  /** 主观感知权重（0.5~1.5），用户驱动，默认 1.0 */
  subjectiveAdjust: number;
}

export interface KlinePoint {
  age: number;
  price: number;
  invest: number;
  total: number;
}

export interface Milestone {
  id: string;
  name: string;
  icon: string;
  desc: string;
  bonus: number;
  condition: (p: UserProfile) => boolean;
}
