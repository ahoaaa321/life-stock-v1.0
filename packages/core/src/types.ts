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
  /** 自定义分类 id（未设置时为内置六类）；引擎计算仍以 type 为准 */
  customType?: string;
}

/** 用户自定义投入分类（引擎计算归入 baseType） */
export interface CustomType {
  id: string;
  name: string;
  icon: string;
  color: string;
  baseType: InvestType;
  /** 归档后不再出现在选择器，历史记录保留 */
  archived?: boolean;
}

/** 成长习惯 */
export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  /** daily=每天一次；weekly=每周 timesPerWeek 次 */
  cadence: 'daily' | 'weekly';
  timesPerWeek: number;
  /** 关联投入分类（内置 type 或自定义分类 id），打卡时可联动记一笔 0 元投入 */
  linkedType?: string;
  /** 打卡是否同时记一笔投入（事件，金额 0） */
  investOnCheck: boolean;
  createdAt: Date;
  archived?: boolean;
}

/** 习惯打卡记录：date 为本地 yyyy-MM-dd */
export interface HabitCheck {
  habitId: string;
  date: string;
  /** 是否为补卡 */
  makeup?: boolean;
}

/** 成长待办 */
export interface GrowthTodo {
  id: string;
  title: string;
  note?: string;
  /** 1 高 / 2 中 / 3 低 */
  priority: 1 | 2 | 3;
  /** 本地 yyyy-MM-dd */
  dueDate?: string;
  done: boolean;
  createdAt: Date;
  doneAt?: Date;
}

/** 手动/自动成长大事件 */
export interface LifeEvent {
  id: string;
  date: Date;
  icon: string;
  title: string;
  desc?: string;
  /** manual=用户手动可删；streak=连续打卡自动生成不可删 */
  kind?: 'manual' | 'streak';
}

/** 成长指数预警线（本地计算） */
export interface PriceAlert {
  /** 目标位（点） */
  target?: number;
  /** 支撑位（点） */
  floor?: number;
  targetHit?: boolean;
  floorHit?: boolean;
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

  // ---- v1.3 个性化与互动功能（全部可选，旧数据兼容）----
  /** 自定义投入分类 */
  customTypes?: CustomType[];
  /** 成长习惯 */
  habits?: Habit[];
  /** 习惯打卡记录 */
  habitChecks?: HabitCheck[];
  /** 成长待办 */
  todos?: GrowthTodo[];
  /** 手动/自动成长大事件 */
  lifeEvents?: LifeEvent[];
  /** 每月投入金额预算（元） */
  monthlyBudget?: number;
  /** 每月投入笔数预算（未授权敏感金额时使用） */
  monthlyCountBudget?: number;
  /** 指数预警线 */
  priceAlert?: PriceAlert;
  /** 昵称 */
  nickname?: string;
  /** emoji 头像 */
  avatar?: string;
  /** 自定义成长指数名称 */
  indexName?: string;
  /** 个性签名 */
  signature?: string;

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
