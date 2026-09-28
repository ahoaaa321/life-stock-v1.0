import { describe, it, expect } from 'vitest';
import {
  generateHistory, migrate,
  applyEnhancedSurvey, defaultEduStages, getSurveyCoverage,
  getIncomeAtAge, getIncomeGrowthAtAge, verifiedAges,
  generateKline, calculateStock, calcConfidence,
} from '@life-stock/core';
import type { UserProfile, EnhancedSurveyInput } from '@life-stock/core';

function makeUser(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    age: 28,
    region: 'tier1',
    area: 'urban',
    income: 'avg',
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
    history: generateHistory({ age: 28, region: 'tier1', area: 'urban', income: 'avg', education: 'bachelor' }),
    investments: [],
    familySupportCapital: 0,
    version: '1.3',
    ...overrides,
  };
}

describe('强化调查表 - 默认教育履历', () => {
  it('本科 28 岁预勾选到大学，研究生不勾选', () => {
    const stages = defaultEduStages(makeUser());
    const names = stages.map((s) => s.name);
    expect(names).toContain('小学');
    expect(stages.find((s) => s.name === '大学/大专')!.enrolled).toBe(true);
    expect(stages.find((s) => s.name === '研究生')!.enrolled).toBe(false);
    // 截止年龄不超过当前年龄
    expect(stages.every((s) => s.endAge <= 28)).toBe(true);
  });

  it('硕士预勾研究生阶段', () => {
    const stages = defaultEduStages(makeUser({ education: 'master', age: 25 }));
    expect(stages.find((s) => s.name === '研究生')!.enrolled).toBe(true);
  });
});

describe('applyEnhancedSurvey - 历史重建', () => {
  const input: EnhancedSurveyInput = {
    eduStages: [{ name: '小学', startAge: 6, endAge: 11, totalCost: 60000 }],
    bigInvests: [{ age: 22, amount: 8000, type: 'skill', desc: '职业证书培训' }],
  };

  it('教育花费按年龄均摊，替换该年龄段的估算行', () => {
    const r = applyEnhancedSurvey(makeUser(), input);
    const h = r.user.history;
    const xiao = h.filter((x) => x.source === 'survey' && x.desc === '小学');
    expect(xiao).toHaveLength(6);
    expect(xiao.every((x) => Math.abs(x.invest - 10000) < 0.01)).toBe(true);
    // 6~11 岁不再有估算教育行
    expect(h.some((x) => x.source === 'estimated' && x.age >= 6 && x.age <= 11)).toBe(false);
    // 其他年龄保留估算
    expect(h.some((x) => x.source === 'estimated' && x.age === 15)).toBe(true);
    // 大额投入按真实类型入历史
    const big = h.find((x) => x.age === 22 && x.source === 'survey' && x.type === 'skill');
    expect(big?.invest).toBe(8000);
  });

  it('重复提交幂等，不产生重复行', () => {
    const u1 = applyEnhancedSurvey(makeUser(), input).user;
    const u2 = applyEnhancedSurvey(u1, input).user;
    expect(u2.history).toHaveLength(u1.history.length);
    expect(u2.history.filter((x) => x.desc === '小学')).toHaveLength(6);
  });

  it('0 元大额投入仍标记为真实事件', () => {
    const r = applyEnhancedSurvey(makeUser(), {
      bigInvests: [{ age: 25, amount: 0, type: 'health', desc: '马拉松报名' }],
    });
    expect(r.user.history.some((x) => x.age === 25 && x.source === 'survey')).toBe(true);
    expect(verifiedAges(r.user).has(25)).toBe(true);
  });

  it('非法年龄/负花费被忽略', () => {
    const r = applyEnhancedSurvey(makeUser(), {
      eduStages: [{ name: '未来', startAge: 30, endAge: 33, totalCost: 100000 }],
      bigInvests: [{ age: 99, amount: 5000, type: 'other' }],
    });
    expect(r.user.history.some((x) => x.source === 'survey')).toBe(false);
  });
});

describe('applyEnhancedSurvey - 画像与职业', () => {
  it('学习时长/健康分/家庭支持/当前年薪被校准', () => {
    const r = applyEnhancedSurvey(makeUser(), {
      studyHours: 12,
      healthScore: 88,
      familySupportCapital: 30,
      career: { workStartAge: 22, startingSalary: 100000, avgRaisePct: 10, currentSalary: 220000 },
    });
    expect(r.user.studyHours).toBe(12);
    expect(r.user.healthScore).toBe(88);
    expect(r.user.familySupportCapital).toBe(30);
    expect(r.user.annualIncome).toBe(220000);
    expect(r.user.annualIncomeGrowth).toBeCloseTo(0.1, 5);
    expect(r.user.enhancedSurvey?.career?.workStartAge).toBe(22);
  });

  it('收入轨迹：工作前为 0，工作后按加薪复利，封顶当前年薪 1.1 倍', () => {
    const u = applyEnhancedSurvey(makeUser(), {
      career: { workStartAge: 22, startingSalary: 100000, avgRaisePct: 10 },
    }).user;
    expect(getIncomeAtAge(u, 18)).toBe(0);
    expect(getIncomeAtAge(u, 22)).toBe(100000);
    expect(getIncomeAtAge(u, 23)).toBe(110000);
    // 100000 * 1.1^6 ≈ 177156，低于封顶 220000
    expect(getIncomeAtAge(u, 28)).toBe(177156);
    expect(getIncomeGrowthAtAge(u, 20)).toBe(0);
    expect(getIncomeGrowthAtAge(u, 25)).toBeCloseTo(0.1, 5);
  });

  it('无职业轨迹时沿用当前画像（旧行为）', () => {
    const u = makeUser();
    expect(getIncomeAtAge(u, 5)).toBe(200000);
    expect(getIncomeGrowthAtAge(u, 5)).toBeCloseTo(0.1, 5);
  });
});

describe('applyEnhancedSurvey - 波折合并', () => {
  it('同年同类型去重，不同类型保留', () => {
    const r = applyEnhancedSurvey(makeUser(), {
      setbacks: [
        { age: 24, type: 'jobloss', severity: 8 },
        { age: 24, type: 'jobloss', severity: 5 },
        { age: 26, type: 'illness', severity: 3 },
      ],
    });
    const sb = r.user.setbacks!;
    expect(sb).toHaveLength(2);
    expect(sb.find((s) => s.date.getFullYear() === 1998 + 24)!.severity).toBe(8);
  });

  it('再次提交不会重复追加已有波折', () => {
    const input: EnhancedSurveyInput = { setbacks: [{ age: 24, type: 'jobloss', severity: 8 }] };
    const u1 = applyEnhancedSurvey(makeUser(), input).user;
    const u2 = applyEnhancedSurvey(u1, input).user;
    expect(u2.setbacks).toHaveLength(1);
  });
});

describe('置信度与覆盖度', () => {
  it('调查后置信度提升、统计真实笔数', () => {
    const before = calcConfidence(makeUser());
    expect(before.surveyCount).toBe(0);
    expect(before.level).toBe('low');
    const r = applyEnhancedSurvey(makeUser(), {
      eduStages: [
        { name: '小学', startAge: 6, endAge: 11, totalCost: 60000 },
        { name: '中学', startAge: 12, endAge: 17, totalCost: 90000 },
      ],
    });
    expect(r.after.surveyCount).toBe(12);
    expect(r.after.estimatedRatio).toBeLessThan(before.estimatedRatio);
    expect(['high', 'medium']).toContain(r.after.level);
    expect(r.coverage.verifiedYears).toBe(12);
    expect(r.coverage.totalYears).toBe(29);
    expect(getSurveyCoverage(r.user).ratio).toBeCloseTo(12 / 29, 1);
  });
});

describe('K 线数据来源优化', () => {
  it('曲线确定性：两次生成结果完全一致', () => {
    const u = makeUser();
    const a = generateKline(u).map((p) => p.price);
    const b = generateKline(u).map((p) => p.price);
    expect(a).toEqual(b);
  });

  it('当前年龄点位与实时指数严格一致', () => {
    const u = makeUser();
    const pts = generateKline(u);
    expect(pts[pts.length - 1].price).toBe(calculateStock(u).price);
  });

  it('真实年份波动小于估算年份', () => {
    const u = applyEnhancedSurvey(makeUser(), {
      eduStages: [{ name: '小学', startAge: 6, endAge: 11, totalCost: 60000 }],
    }).user;
    const pts = generateKline(u);
    expect(pts.find((p) => p.age === 8)!.verified).toBe(true);
    expect(pts.find((p) => p.age === 15)!.verified).toBe(false);
  });

  it('波折年份标记并形成回撤', () => {
    const u = applyEnhancedSurvey(makeUser(), {
      setbacks: [{ age: 25, type: 'jobloss', severity: 10 }],
    }).user;
    const pts = generateKline(u);
    expect(pts.find((p) => p.age === 25)!.setback).toBe(true);
    const base = generateKline(makeUser());
    const withDip = pts.find((p) => p.age === 25)!.price;
    const withoutDip = base.find((p) => p.age === 25)!.price;
    expect(withDip).toBeLessThan(withoutDip * 0.86);
  });
});

describe('v1.3 迁移', () => {
  it('旧历史数据补 source=estimated 标记', () => {
    const old = makeUser();
    old.version = '1.2';
    old.history.forEach((h) => { delete h.source; });
    const m = migrate(old, '1.2');
    expect(m.history.every((h) => h.source === 'estimated')).toBe(true);
    expect(m.version).toBe('1.3');
  });
});
