import { describe, it, expect } from 'vitest';
import { redeemSeedCode, normalizeSeedCode, SEED_CODES } from '@life-stock/core';
import type { UserProfile } from '@life-stock/core';

function baseUser(over: Partial<UserProfile> = {}): UserProfile {
  return {
    age: 25, region: 'tier2', area: 'urban', income: 'avg', education: 'bachelor',
    birthYear: 2001, annualIncome: 100000, annualIncomeGrowth: 0.05,
    studyHours: 5, healthScore: 75, debtRatio: 0,
    hasJob: false, salaryRaised: false, hasLicense: false, marathon: false,
    married: false, hasHouse: false, hasChild: false,
    totalInvest: 0, history: [], investments: [],
    subjectiveWeight: 1, ...over,
  };
}

describe('normalizeSeedCode', () => {
  it('去空格并转大写', () => {
    expect(normalizeSeedCode(' growth-01 ')).toBe('GROWTH-01');
  });
  it('兼容下划线与长横线', () => {
    expect(normalizeSeedCode('growth_03')).toBe('GROWTH-03');
    expect(normalizeSeedCode('GROWTH—05')).toBe('GROWTH-05');
  });
});

describe('redeemSeedCode', () => {
  it('有效码激活成功并写入字段', () => {
    const u = baseUser();
    const r = redeemSeedCode(u, 'growth-01', new Date('2026-09-30T08:00:00Z'));
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.user.seedTester).toBe(true);
      expect(r.user.seedCode).toBe('GROWTH-01');
      expect(r.user.seedActivatedAt).toBe('2026-09-30T08:00:00.000Z');
      // 纯函数：不修改原对象
      expect(u.seedTester).toBeUndefined();
    }
  });

  it('五个码均有效', () => {
    for (const code of SEED_CODES) {
      const r = redeemSeedCode(baseUser(), code);
      expect(r.ok).toBe(true);
    }
  });

  it('空输入返回 empty', () => {
    const r = redeemSeedCode(baseUser(), '   ');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('empty');
  });

  it('错误码返回 invalid', () => {
    const r = redeemSeedCode(baseUser(), 'GROWTH-99');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('invalid');
  });

  it('重复激活返回 already', () => {
    const first = redeemSeedCode(baseUser(), 'GROWTH-02');
    expect(first.ok).toBe(true);
    if (first.ok) {
      const second = redeemSeedCode(first.user, 'GROWTH-03');
      expect(second.ok).toBe(false);
      if (!second.ok) expect(second.reason).toBe('already');
    }
  });
});
