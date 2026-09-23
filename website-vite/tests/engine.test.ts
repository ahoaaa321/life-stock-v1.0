import { describe, it, expect } from 'vitest';
import {
  Constants, FORMULA_VERSION,
  decay, getStageCoef, calculateStock, calculateBV,
  calcGrowthCoef, calcQualityCoef, calcRiskDiscount,
  calcSubjectiveAdjust, setSubjectiveWeight,
  calcAttribution, getTopContributor,
  generateHistory,
  migrate, withVersion,
} from '@life-stock/core';
import type { UserProfile } from '@life-stock/core';

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
