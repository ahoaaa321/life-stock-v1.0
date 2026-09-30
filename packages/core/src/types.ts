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
  /** estimated=模型估算（默认）；survey=强化调查表录入的真实数据 */
  source?: 'estimated' | 'survey';
  /** 调查录入时的来源说明（如教育阶段名、大额投入描述） */
  desc?: string;
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
  /** 强化调查表档案（真实履历，用于提升 K 线准确度） */
  enhancedSurvey?: EnhancedSurvey;
  /** 低谷恢复计划列表（记录挫折后生成，调研 Q5 第一刚需 74.5%） */
  recoveryPlans?: import('./recovery').RecoveryPlan[];

  /** 是否仅完成快速 4 问（先体验后补录）。true 时其余画像字段为默认值，可随时续填完善 */
  quickOnboarded?: boolean;

  /** 种子体验官：通过内测邀请码激活 */
  seedTester?: boolean;
  /** 激活使用的邀请码（如 GROWTH-01），用于识别种子来源 */
  seedCode?: string;
  /** 激活时间（ISO 字符串） */
  seedActivatedAt?: string;

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
  /** 该年龄是否含强化调查的真实数据 */
  verified?: boolean;
  /** 该年龄是否发生了用户记录的波折 */
  setback?: boolean;
}

/** 强化调查表：教育经历段 */
export interface EduStageInput {
  name: string;
  startAge: number;
  endAge: number;
  /** 该阶段总花费（元） */
  totalCost: number;
}
/** 强化调查表：印象深刻的大额投入 */
export interface BigInvestInput {
  age: number;
  amount: number;
  type: InvestType;
  desc?: string;
}
/** 强化调查表：职业与收入轨迹 */
export interface CareerInput {
  /** 参加工作年龄 */
  workStartAge?: number;
  /** 第一份工作年薪（元） */
  startingSalary?: number;
  /** 年均加薪百分比，如 5 表示 5% */
  avgRaisePct?: number;
  /** 当前年薪确认（元） */
  currentSalary?: number;
}
/** 强化调查表：历史波折 */
export interface SurveySetbackInput {
  age: number;
  type: Setback['type'];
  /** 1~10 */
  severity: number;
}
/** 强化调查表完整输入（所有字段均可跳过） */
export interface EnhancedSurveyInput {
  eduStages?: EduStageInput[];
  bigInvests?: BigInvestInput[];
  career?: CareerInput;
  studyHours?: number;
  healthScore?: number;
  familySupportCapital?: number;
  setbacks?: SurveySetbackInput[];
}
/** 已保存的强化调查档案 */
export interface EnhancedSurvey extends EnhancedSurveyInput {
  completedAt: Date;
}
export interface SurveyCoverage {
  /** 被真实数据覆盖的年数 */
  verifiedYears: number;
  /** 总年数（0~当前年龄） */
  totalYears: number;
  /** 0~1 */
  ratio: number;
}

export interface Milestone {
  id: string;
  name: string;
  icon: string;
  desc: string;
  bonus: number;
  condition: (p: UserProfile) => boolean;
}
