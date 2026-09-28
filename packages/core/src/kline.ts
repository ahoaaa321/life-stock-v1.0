import type { UserProfile, KlinePoint } from './types';
import { calculateStock } from './formula';
import { Constants } from './constants';
import { verifiedAges, getIncomeAtAge, getIncomeGrowthAtAge, setbackSeverityAtAge } from './survey';

// ============ K线（人生走势图）生成 ============

/** 确定性伪随机（同一年龄每次渲染抖动一致，避免曲线反复跳动） */
function seededNoise(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s); // 0~1
}

/**
 * 生成从出生到当前年龄的人生指数走势数据
 *
 * 数据来源优化（v1.3 强化调查）：
 * - 含真实数据的年龄波动幅度收窄（±3.5%），纯估算年龄保持 ±8%
 * - 当前年龄不抖动，与仪表盘实时指数严格一致
 * - 历史年份收入/收入增速按职业轨迹重建
 * - 用户记录的波折在对应年龄形成回撤（最多 -15%）
 */
export function generateKline(user: UserProfile): KlinePoint[] {
  const points: KlinePoint[] = [];
  const verified = verifiedAges(user);
  let cumulative = 0;
  for (let age = 0; age <= user.age; age++) {
    const yearHistory = user.history.filter((h) => h.age === age);
    let yearInvest = yearHistory.reduce((s, h) => s + h.invest, 0);
    const yearInv = user.investments.filter((inv) => {
      const invAge = Math.floor(
        (inv.date.getTime() - new Date(user.birthYear + age, 0, 1).getTime()) /
          (365.25 * 24 * 3600 * 1000)
      );
      return invAge === age;
    });
    yearInvest += yearInv.reduce((s, i) => s + i.amount, 0);
    cumulative += yearInvest;

    const tempUser: UserProfile = {
      ...user,
      age,
      annualIncome: getIncomeAtAge(user, age),
      annualIncomeGrowth: getIncomeGrowthAtAge(user, age),
      history: user.history.filter((h) => h.age <= age),
      investments: yearInv,
    };
    const snapshot = calculateStock(tempUser);
    const isVerified = verified.has(age);
    const isCurrent = age === user.age;
    // 真实年份小波动，估算年份大波动，当前年不波动
    const amplitude = isCurrent ? 0 : isVerified ? 0.035 : 0.08;
    const volatility = 1 + (seededNoise(age + 1) - 0.5) * 2 * amplitude;
    // 波折回撤：严重度 1~10 → 1.5%~15%
    const sev = setbackSeverityAtAge(user, age);
    const setbackFactor = sev > 0 ? 1 - (sev / 10) * 0.15 : 1;
    const price = snapshot.price * volatility * setbackFactor;
    points.push({
      age,
      price: Math.round(price * 10) / 10,
      invest: yearInvest,
      total: cumulative,
      verified: isVerified,
      setback: sev > 0,
    });
  }
  return points;
}

// ============ 同龄人基准价 ============

/**
 * 估算同年龄、同地区、相同学历的"平均人"基准指数
 */
export function getPeerBenchmark(user: UserProfile): number {
  const eduCoef: Record<string, number> = {
    primary: 0.5,
    junior: 0.8,
    senior: 1.0,
    college: 1.2,
    bachelor: 1.3,
    master: 1.5,
  };
  const avgProfile: UserProfile = {
    age: user.age,
    region: user.region,
    area: user.area,
    income: 'avg',
    education: user.education,
    birthYear: user.birthYear,
    annualIncome: 80000 * (eduCoef[user.education] || 1),
    annualIncomeGrowth: 0.05,
    studyHours: 2,
    healthScore: 65,
    debtRatio: 0.05,
    hasJob: user.age >= 22,
    salaryRaised: user.age >= 25,
    hasLicense: user.age >= 20,
    marathon: false,
    married: user.age >= 28,
    hasHouse: user.age >= 30,
    hasChild: user.age >= 32,
    totalInvest: 0,
    history: generateHistoryForPeer(user),
    investments: [],
  };
  return calculateStock(avgProfile).price;
}

function generateHistoryForPeer(user: UserProfile) {
  const coef =
    Constants.REGION_COEF[user.region] *
    Constants.AREA_COEF[user.area] *
    Constants.INCOME_COEF.avg;
  const history = [];
  for (let age = 0; age <= user.age; age++) {
    let annualSpend: number;
    if (age <= 2) annualSpend = Constants.AGE_SPEND['0-2'];
    else if (age <= 5) annualSpend = Constants.AGE_SPEND['3-5'];
    else if (age <= 14) annualSpend = Constants.AGE_SPEND['6-14'];
    else if (age <= 17) annualSpend = Constants.AGE_SPEND['15-17'];
    else annualSpend = Constants.AGE_SPEND['18-22'];
    annualSpend = annualSpend * coef;
    history.push({ age, invest: annualSpend, type: 'education' as const });
  }
  return history;
}
