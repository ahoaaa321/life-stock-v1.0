import type { HistoryItem, Region, Area, IncomeLevel, Education } from './types';
import { Constants } from './constants';

// ============ 历史数据生成 ============

/**
 * 基于问卷参数生成历史投入估算（参考区间，非精确值）
 * 用户可通过锚点校准修正
 */
export function generateHistory(profile: {
  age: number;
  region: Region;
  area: Area;
  income: IncomeLevel;
  education: Education;
  anchor?: { age: number; amount: number };
}): HistoryItem[] {
  const coef =
    Constants.REGION_COEF[profile.region] *
    Constants.AREA_COEF[profile.area] *
    Constants.INCOME_COEF[profile.income];
  const history: HistoryItem[] = [];
  for (let age = 0; age <= profile.age; age++) {
    let annualSpend: number;
    if (age <= 2) annualSpend = Constants.AGE_SPEND['0-2'];
    else if (age <= 5) annualSpend = Constants.AGE_SPEND['3-5'];
    else if (age <= 14) annualSpend = Constants.AGE_SPEND['6-14'];
    else if (age <= 17) annualSpend = Constants.AGE_SPEND['15-17'];
    else annualSpend = Constants.AGE_SPEND['18-22'];
    annualSpend = annualSpend * coef * (0.9 + Math.random() * 0.2);
    history.push({ age, invest: annualSpend, type: 'education', source: 'estimated' });
  }
  if (profile.anchor) {
    const idx = profile.anchor.age;
    if (history[idx]) history[idx].invest = profile.anchor.amount;
  }
  return history;
}
