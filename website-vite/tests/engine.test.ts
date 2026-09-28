import { describe, it, expect } from 'vitest';
import {
  Constants, FORMULA_VERSION,
  decay, getStageCoef, calculateStock, calculateBV,
  calcGrowthCoef, calcQualityCoef, calcRiskDiscount,
  calcSubjectiveAdjust, setSubjectiveWeight,
  calcAttribution, getTopContributor,
  generateHistory,
  migrate, withVersion,
  dayKey, createHabit, toggleCheck, getHabitStatus, getBestStreak, getHeatmap,
  createTodo, toggleDone, isOverdue, sortTodos,
  getMonthSummary, getBudgetStatus,
  categoryBreakdown, monthlyTrend, TYPE_META,
  addManualEvent, addSystemEvent, deleteEvent, buildTimeline,
  evaluateAlert,
} from '@life-stock/core';
import type { UserProfile, Habit, CustomType } from '@life-stock/core';

// 测试用标准用户
function makeUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    age: 28,
    region: 'tier1',
    area: 'urban',
    income: 'high',
    education: 'bachelor',
    birthYear: 1998,
    annualIncome: 200000,
    annualIncomeGrowth: 0.1,
    studyHours: 5,
    healthScore: 75,
    debtRatio: 0,
    hasJob: true,
    salaryRaised: true,
    hasLicense: true,
    marathon: false,
    married: false,
    hasHouse: false,
    hasChild: false,
    totalInvest: 0,
    history: generateHistory({ age: 28, region: 'tier1', area: 'urban', income: 'high', education: 'bachelor' }),
    investments: [],
    familySupportCapital: 0,
    version: FORMULA_VERSION,
    ...overrides,
  };
}

describe('Constants', () => {
  it('BV 使用万元换算（无 NORMALIZATION_K）', () => {
    expect('NORMALIZATION_K' in Constants).toBe(false);
    expect(Constants.BASE_INDEX).toBe(100);
  });

  it('娱乐权重为 0.5', () => {
    expect(Constants.TYPE_WEIGHTS.entertainment).toBe(0.5);
  });

  it('学历半衰期为 Infinity（不折旧）', () => {
    expect(Constants.TYPE_HALF_LIFE.education).toBe(Infinity);
  });

  it('阶段系数包含 65 岁节点', () => {
    expect(Constants.STAGE_COEF.find((n) => n.age === 65)?.coef).toBe(1.0);
  });
});

describe('decay 折旧', () => {
  it('学历不折旧', () => {
    expect(decay(100, 5, 'education')).toBe(100);
    expect(decay(100, 100, 'education')).toBe(100);
  });

  it('技能 5 年半衰期：5年后剩 50%', () => {
    expect(Math.round(decay(100, 5, 'skill'))).toBe(50);
  });

  it('娱乐 1 年半衰期：1年后剩 50%', () => {
    expect(Math.round(decay(100, 1, 'entertainment'))).toBe(50);
  });
});

describe('getStageCoef 阶段系数插值', () => {
  it('节点值精确匹配', () => {
    expect(getStageCoef(0)).toBe(0.2);
    expect(getStageCoef(6)).toBe(0.3);
    expect(getStageCoef(18)).toBe(0.9);
    expect(getStageCoef(35)).toBe(1.5);
    expect(getStageCoef(65)).toBe(1.0);
    expect(getStageCoef(80)).toBe(0.8);
  });

  it('28岁在25(1.1)和35(1.5)之间线性插值', () => {
    expect(getStageCoef(28)).toBeCloseTo(1.22, 2);
  });

  it('无阶跃：相邻年龄差异连续', () => {
    const c1 = getStageCoef(17.9);
    const c2 = getStageCoef(18.1);
    expect(Math.abs(c2 - c1)).toBeLessThan(0.05);
  });
});

describe('系数定义（v1.2）', () => {
  it('成长系数范围 0.65~1.5', () => {
    expect(calcGrowthCoef(makeUser({ annualIncomeGrowth: 1, studyHours: 100 }))).toBeLessThanOrEqual(1.5);
    expect(calcGrowthCoef(makeUser({ annualIncomeGrowth: -1, studyHours: 0 }))).toBeGreaterThanOrEqual(0.65);
  });

  it('成长系数：增速10%+学习5小时 = 1.2', () => {
    expect(calcGrowthCoef(makeUser({ annualIncomeGrowth: 0.1, studyHours: 5 }))).toBeCloseTo(1.2, 2);
  });

  it('质量系数：健康75分 = 0.6 + 0.75*0.7 = 1.125', () => {
    expect(calcQualityCoef(75)).toBeCloseTo(1.125, 3);
  });

  it('质量系数范围 0.6~1.3', () => {
    expect(calcQualityCoef(0)).toBe(0.6);
    expect(calcQualityCoef(100)).toBeCloseTo(1.3, 5);
  });

  it('风险折扣：负债率50% = 0.15', () => {
    expect(calcRiskDiscount(makeUser({ debtRatio: 0.5 }))).toBeCloseTo(0.15, 2);
  });

  it('风险折扣封顶 0.3', () => {
    expect(calcRiskDiscount(makeUser({ debtRatio: 2 }))).toBe(0.3);
  });
});

describe('calculateStock 主计算', () => {
  it('返回有效的数值快照', () => {
    const user = makeUser();
    const stock = calculateStock(user);
    expect(stock.price).toBeGreaterThan(0);
    expect(stock.bv).toBeGreaterThan(0);
    expect(stock.eps).toBe(20);
    expect(stock.milestoneBonus).toBeGreaterThan(0);
  });

  it('ROE = EPS / (BV + 1)，BV=0 时不除零且封顶', () => {
    const user = makeUser({ annualIncome: 100000, history: [], investments: [], familySupportCapital: 0 });
    const stock = calculateStock(user);
    expect(stock.roe).toBeLessThanOrEqual(1000);
    expect(isFinite(stock.roe)).toBe(true);
  });

  it('EPS=0 时 PE 显示"—"', () => {
    const user = makeUser({ annualIncome: 0 });
    const stock = calculateStock(user);
    expect(stock.pe).toBe('—');
  });

  it('里程碑加成封顶 200', () => {
    // 构造一个达成所有里程碑的用户
    const user = makeUser({
      age: 60, hasJob: true, salaryRaised: true, hasLicense: true,
      marathon: true, married: true, hasHouse: true, hasChild: true,
      totalInvest: 600000,
    });
    const stock = calculateStock(user);
    expect(stock.milestoneBonus).toBeLessThanOrEqual(200);
  });

  it('BV 包含家庭支持资本', () => {
    const user = makeUser({ familySupportCapital: 50 });
    const stock = calculateStock(user);
    // 家庭支持资本 50 万应直接计入 BV
    expect(stock.bv).toBeGreaterThanOrEqual(50);
  });

  it('BV 非负', () => {
    const stock = calculateStock(makeUser());
    expect(stock.bv).toBeGreaterThanOrEqual(0);
  });
});

describe('generateHistory', () => {
  it('生成从0到指定年龄的历史', () => {
    const history = generateHistory({ age: 10, region: 'tier1', area: 'urban', income: 'avg', education: 'bachelor' });
    expect(history.length).toBe(11);
    expect(history[0].age).toBe(0);
    expect(history[10].age).toBe(10);
  });

  it('锚点校准替换指定年龄投入', () => {
    const history = generateHistory({ age: 10, region: 'tier1', area: 'urban', income: 'avg', education: 'bachelor', anchor: { age: 5, amount: 50000 } });
    expect(history[5].invest).toBe(50000);
  });
});

describe('数据版本与迁移', () => {
  it('导出数据包含 version 与 disclaimer', () => {
    const data = withVersion(makeUser());
    expect(data.version).toBe(FORMULA_VERSION);
    expect(data.disclaimer).toContain('模型估算');
  });

  it('migrate 为旧数据补充 familySupportCapital 与 version', () => {
    const oldUser = makeUser();
    delete (oldUser as any).familySupportCapital;
    delete (oldUser as any).version;
    const migrated = migrate(oldUser, '1.1');
    expect(migrated.familySupportCapital).toBe(0);
    expect(migrated.version).toBe(FORMULA_VERSION);
  });
});

// ============ 主观感知权重（B 模型个性化） ============
describe('主观感知权重', () => {
  it('未设置时默认为 1.0（中性，不放大不缩小）', () => {
    const user = makeUser();
    delete (user as any).subjectiveWeight;
    expect(calcSubjectiveAdjust(user)).toBe(1.0);
  });

  it('范围限制在 0.5~1.5', () => {
    expect(setSubjectiveWeight(0.1)).toBe(0.5);
    expect(setSubjectiveWeight(2.0)).toBe(1.5);
    expect(setSubjectiveWeight(1.0)).toBe(1.0);
  });

  it('主观权重影响最终指数（1.0→1.5 指数上升）', () => {
    const base = calculateStock(makeUser({ subjectiveWeight: 1.0 })).price;
    const high = calculateStock(makeUser({ subjectiveWeight: 1.5 })).price;
    expect(high).toBeGreaterThan(base);
  });

  it('主观权重不影响客观 BV', () => {
    const user = makeUser({ subjectiveWeight: 1.0 });
    const bvNeutral = calculateBV(user);
    user.subjectiveWeight = 1.5;
    const bvHigh = calculateBV(user);
    expect(bvNeutral).toBe(bvHigh);
  });
});

// ============ 归因分析 ============
describe('归因分析', () => {
  it('返回所有因子的归因项', () => {
    const user = makeUser();
    const stock = calculateStock(user);
    const items = calcAttribution(user, stock);
    expect(items.length).toBeGreaterThanOrEqual(5);
    expect(items.map(i => i.key)).toContain('bv');
    expect(items.map(i => i.key)).toContain('milestone');
  });

  it('最大贡献因子存在且贡献为正', () => {
    const user = makeUser();
    const stock = calculateStock(user);
    const items = calcAttribution(user, stock);
    const top = getTopContributor(items);
    expect(top).not.toBeNull();
    expect(top!.contribution).toBeGreaterThan(0);
  });

  it('归因贡献之和不超过最终指数（无虚高）', () => {
    const user = makeUser();
    const stock = calculateStock(user);
    const items = calcAttribution(user, stock);
    const totalContrib = items.reduce((s, i) => s + i.contribution, 0);
    expect(totalContrib).toBeLessThanOrEqual(stock.price * 1.01);
  });
});

// ============ 属性测试（v1.2 要求） ============
describe('属性测试', () => {
  it('投入增加，指数不下降（其他条件不变）', () => {
    const base = makeUser();
    const basePrice = calculateStock(base).price;
    const more = makeUser({
      investments: [{ date: new Date(), amount: 100000, type: 'education' }],
    });
    expect(calculateStock(more).price).toBeGreaterThanOrEqual(basePrice);
  });

  it('年龄边界不报错（0~120岁）', () => {
    for (const age of [0, 1, 18, 35, 65, 80, 100, 120]) {
      const stock = calculateStock(makeUser({ age, birthYear: 2026 - age }));
      expect(isFinite(stock.price)).toBe(true);
      expect(stock.price).toBeGreaterThan(0);
    }
  });

  it('BV 始终非负', () => {
    for (const age of [0, 18, 35, 80]) {
      const bv = calculateBV(makeUser({ age, birthYear: 2026 - age, history: [], investments: [] }));
      expect(bv).toBeGreaterThanOrEqual(0);
    }
  });

  it('指数始终有限（无 Infinity/NaN）', () => {
    const edge = makeUser({ annualIncome: 0, debtRatio: 2, healthScore: 0, history: [], investments: [] });
    const stock = calculateStock(edge);
    expect(isFinite(stock.price)).toBe(true);
    expect(isFinite(stock.roe)).toBe(true);
    expect(isFinite(stock.bv)).toBe(true);
  });
});

// ============ v1.3 功能模块 ============
const NOW = new Date(2026, 8, 28); // 2026-09-28 周一

function offsetKey(days: number, base: Date = NOW): string {
  const d = new Date(base);
  d.setDate(base.getDate() + days);
  return dayKey(d);
}

describe('habits 习惯打卡', () => {
  const dailyHabit: Habit = {
    id: 'h1', name: '阅读', icon: '📖', color: '#ff8a4c', cadence: 'daily',
    timesPerWeek: 1, investOnCheck: true, createdAt: NOW,
  };
  const weeklyHabit: Habit = {
    id: 'h2', name: '健身', icon: '💪', color: '#3fa06a', cadence: 'weekly',
    timesPerWeek: 3, investOnCheck: false, createdAt: NOW,
  };

  it('dayKey 输出本地 yyyy-MM-dd', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('createHabit 校空名并夹逼周频次数', () => {
    expect(() => createHabit({ name: '  ', icon: '⭐', color: '#fff', cadence: 'daily' })).toThrow();
    const w = createHabit({ name: '健身', icon: '💪', color: '#3fa06a', cadence: 'weekly', timesPerWeek: 99 });
    expect(w.timesPerWeek).toBe(7);
    const d = createHabit({ name: '阅读', icon: '📖', color: '#000', cadence: 'daily' });
    expect(d.timesPerWeek).toBe(1);
    expect(d.investOnCheck).toBe(true); // 默认联动
  });

  it('打卡/取消切换，补卡带 makeup 标记', () => {
    let u = makeUser();
    const r1 = toggleCheck(u, 'h1', offsetKey(0), NOW);
    expect(r1.action).toBe('checked');
    expect(r1.makeup).toBe(false);
    u = r1.user;
    const r2 = toggleCheck(u, 'h1', offsetKey(-2), NOW);
    expect(r2.makeup).toBe(true);
    u = r2.user;
    expect(u.habitChecks).toHaveLength(2);
    u = toggleCheck(u, 'h1', offsetKey(0), NOW).user;
    expect(u.habitChecks).toHaveLength(1);
  });

  it('日频连续天数：今天起向前连续', () => {
    let u = makeUser();
    expect(getHabitStatus(u, dailyHabit, NOW).streak).toBe(0);
    for (const d of [0, -1, -2]) u = toggleCheck(u, 'h1', offsetKey(d), NOW).user;
    const st = getHabitStatus(u, dailyHabit, NOW);
    expect(st.streak).toBe(3);
    expect(st.doneToday).toBe(true);
    expect(st.weekDots).toHaveLength(7);
    expect(st.weekCount).toBe(1); // 本周一只过了今天；周六日属上一周
    // 中间断一天（-4 打卡但 -3 没打），连续仍为 3
    u = toggleCheck(u, 'h1', offsetKey(-4), NOW).user;
    expect(getHabitStatus(u, dailyHabit, NOW).streak).toBe(3);
  });

  it('日频最佳连续纪录', () => {
    let u = makeUser();
    for (const d of [-10, -9, -8, -3, -2, -1, 0]) u = toggleCheck(u, 'h1', offsetKey(d), NOW).user;
    expect(getBestStreak(new Set(u.habitChecks!.map((c) => c.date)), dailyHabit, NOW)).toBe(4);
  });

  it('周频：本周未达标则从上周起算连续达标周', () => {
    let u = makeUser();
    // 本周一（今天）打 1 次，未达 3 次；上上周、上周各达标
    for (const d of [0, -7, -6, -4, -14, -13, -11]) u = toggleCheck(u, 'h2', offsetKey(d), NOW).user;
    const st = getHabitStatus(u, weeklyHabit, NOW);
    expect(st.streak).toBe(2);
    expect(st.weekTarget).toBe(3);
    expect(getBestStreak(new Set(u.habitChecks!.map((c) => c.date)), weeklyHabit, NOW)).toBe(2);
  });

  it('热力图为 12 周 x 7 天，未来日标记 future', () => {
    let u = makeUser();
    u = toggleCheck(u, 'h1', offsetKey(0), NOW).user;
    const heat = getHeatmap(u, dailyHabit, 12, NOW);
    expect(heat).toHaveLength(12);
    expect(heat[0]).toHaveLength(7);
    const lastDay = heat[11][6];
    expect(lastDay.future).toBe(true);
    expect(lastDay.checked).toBe(false);
    const today = heat[11][0];
    expect(today.checked).toBe(true);
    expect(today.future).toBe(false);
  });
});

describe('todos 成长待办', () => {
  it('创建/勾选/取消/逾期', () => {
    const t = createTodo({ title: '写完简历', priority: 1, dueDate: '2026-09-01' }, NOW);
    expect(t.done).toBe(false);
    expect(isOverdue(t, '2026-09-28')).toBe(true);
    const done = toggleDone(t, NOW);
    expect(done.done).toBe(true);
    expect(done.doneAt).toEqual(NOW);
    expect(isOverdue(done, '2026-09-28')).toBe(false);
    expect(toggleDone(done, NOW).done).toBe(false);
  });

  it('排序：未完成→优先级→截止日；已完成沉底', () => {
    const low = createTodo({ title: '低', priority: 3 }, NOW);
    const highLater = createTodo({ title: '高晚', priority: 1, dueDate: '2026-10-10' }, NOW);
    const highSoon = createTodo({ title: '高早', priority: 1, dueDate: '2026-09-30' }, NOW);
    const mid = createTodo({ title: '中', priority: 2 }, NOW);
    const finished = toggleDone(createTodo({ title: '已完成', priority: 1 }, NOW), NOW);
    const sorted = sortTodos([low, finished, highLater, mid, highSoon]);
    expect(sorted.map((t) => t.title)).toEqual(['高早', '高晚', '中', '低', '已完成']);
  });
});

describe('budget 月度预算', () => {
  it('跨月边界汇总金额与笔数', () => {
    const u = makeUser({
      investments: [
        { date: new Date(2026, 7, 31), amount: 500, type: 'education' },
        { date: new Date(2026, 8, 1), amount: 600, type: 'health' },
        { date: new Date(2026, 8, 20), amount: 400, type: 'skill' },
        { date: new Date(2026, 8, 25), amount: 0, type: 'other' },
      ],
    });
    expect(getMonthSummary(u.investments, 2026, 8)).toEqual({ amount: 1000, count: 3 });
    expect(getMonthSummary(u.investments, 2026, 7)).toEqual({ amount: 500, count: 1 });
  });

  it('金额预算模式：进度/超支/环比', () => {
    const u = makeUser({
      monthlyBudget: 1000,
      investments: [
        { date: new Date(2026, 7, 10), amount: 500, type: 'education' },
        { date: new Date(2026, 8, 1), amount: 1000, type: 'education' },
      ],
    });
    const st = getBudgetStatus(u, { now: NOW, sensitive: true });
    expect(st.mode).toBe('amount');
    expect(st.budget).toBe(1000);
    expect(st.spent).toBe(1000);
    expect(st.overrun).toBe(false);
    expect(st.ratio).toBe(1);
    expect(st.deltaPct).toBeCloseTo(1, 5);
  });

  it('超支识别 + 无敏感授权时走笔数预算', () => {
    const u = makeUser({
      monthlyBudget: 1000,
      monthlyCountBudget: 3,
      investments: [
        { date: new Date(2026, 8, 1), amount: 600, type: 'education' },
        { date: new Date(2026, 8, 2), amount: 500, type: 'health' },
        { date: new Date(2026, 8, 3), amount: 0, type: 'skill' },
        { date: new Date(2026, 8, 4), amount: 0, type: 'other' },
      ],
    });
    expect(getBudgetStatus(u, { now: NOW, sensitive: true }).overrun).toBe(true);
    const st = getBudgetStatus(u, { now: NOW, sensitive: false });
    expect(st.mode).toBe('count');
    expect(st.spent).toBe(4);
    expect(st.overrun).toBe(true);
  });
});

describe('analytics 分类分析', () => {
  const custom: CustomType = {
    id: 'c1', name: '日语课', icon: '🇯🇵', color: '#e0705b', baseType: 'skill',
  };

  it('自定义分类单列且不丢金额，占比合计 1', () => {
    const u = makeUser({
      customTypes: [custom],
      investments: [
        { date: new Date(2026, 8, 1), amount: 600, type: 'skill', customType: 'c1' },
        { date: new Date(2026, 8, 2), amount: 300, type: 'skill' },
        { date: new Date(2026, 8, 3), amount: 100, type: 'health' },
        { date: new Date(2026, 7, 3), amount: 9999, type: 'education' }, // 上月不计
      ],
    });
    const slices = categoryBreakdown(u, 2026, 8);
    expect(slices).toHaveLength(3);
    expect(slices[0].name).toBe('日语课');
    expect(slices[0].amount).toBe(600);
    expect(slices[0].custom).toBe(true);
    expect(slices.reduce((s, x) => s + x.ratio, 0)).toBeCloseTo(1, 5);
  });

  it('近 6 月趋势按时间正序', () => {
    const u = makeUser({
      investments: [{ date: new Date(2026, 8, 1), amount: 100, type: 'education' }],
    });
    const trend = monthlyTrend(u, 6, NOW);
    expect(trend).toHaveLength(6);
    expect(trend[5].label).toBe('9月');
    expect(trend[5].amount).toBe(100);
    expect(trend[5].count).toBe(1);
    expect(trend[0].amount).toBe(0);
  });

  it('内置六类元信息齐全', () => {
    expect(Object.keys(TYPE_META)).toHaveLength(6);
  });
});

describe('events 大事记', () => {
  it('手动事件可删，系统事件不可删', () => {
    let u = addManualEvent(makeUser(), { title: '拿到 offer', icon: '🎉', date: NOW });
    expect(u.lifeEvents).toHaveLength(1);
    const id = u.lifeEvents![0].id;
    u = addSystemEvent(u, { title: '连续打卡 7 天', icon: '🔥', date: NOW });
    expect(u.lifeEvents).toHaveLength(2);
    u = deleteEvent(u, u.lifeEvents![1].id); // 系统事件删不掉
    expect(u.lifeEvents).toHaveLength(2);
    u = deleteEvent(u, id);
    expect(u.lifeEvents).toHaveLength(1);
    expect(u.lifeEvents![0].kind).toBe('streak');
  });

  it('时间线按月分组倒序，含已达成里程碑', () => {
    const u = makeUser({
      age: 28,
      investments: [{ date: new Date(2026, 8, 10), amount: 200, type: 'health', desc: '体检' }],
      journals: [{ id: 'j1', date: new Date(2026, 8, 12), content: '今天很专注', mood: 'good' }],
    });
    const tl = buildTimeline(u);
    expect(tl.months[0].label).toContain('2026');
    expect(tl.months[0].items.length).toBe(2);
    expect(tl.months[0].items[0].title).toContain('专注'); // 12 日在 10 日前
    expect(tl.achievedMilestones.some((m) => m.name === '出生')).toBe(true);
  });
});

describe('alerts 预警线', () => {
  it('目标位穿越只庆祝一次，回落后复位', () => {
    let r = evaluateAlert(105, { target: 100 });
    expect(r.targetNew).toBe(true);
    expect(r.alert.targetHit).toBe(true);
    r = evaluateAlert(101, r.alert);
    expect(r.targetNew).toBe(false);
    r = evaluateAlert(99, r.alert); // 回落复位
    expect(r.alert.targetHit).toBe(false);
    r = evaluateAlert(100, r.alert);
    expect(r.targetNew).toBe(true);
  });

  it('支撑位跌破提示', () => {
    const r = evaluateAlert(80, { floor: 90 });
    expect(r.floorNew).toBe(true);
    expect(r.alert.floorHit).toBe(true);
    expect(evaluateAlert(85, r.alert).floorNew).toBe(false);
  });
});
