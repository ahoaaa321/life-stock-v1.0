// ============ 投入分析：分类占比与月度趋势 ============
import type { UserProfile, Investment, InvestType } from './types';

/** 内置六类的展示元信息（UI 与分析共用） */
export const TYPE_META: Record<InvestType, { name: string; icon: string; color: string }> = {
  education: { name: '教育', icon: '🎓', color: '#ff8a4c' },
  skill: { name: '技能', icon: '📚', color: '#f5a623' },
  health: { name: '健康', icon: '💪', color: '#3fa06a' },
  network: { name: '人脉', icon: '🤝', color: '#3e9b8f' },
  entertainment: { name: '娱乐', icon: '🎮', color: '#e0705b' },
  other: { name: '其他', icon: '📦', color: '#a79b8c' },
};

export interface CategorySlice {
  /** 内置 type 或 custom:<id> */
  key: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  count: number;
  /** 0~1 */
  ratio: number;
  custom: boolean;
}

/** 某月分类占比（自定义分类单列，其余按内置 type 归集），按金额降序 */
export function categoryBreakdown(
  user: UserProfile,
  year: number,
  month: number,
): CategorySlice[] {
  const customMap = new Map((user.customTypes || []).map((c) => [c.id, c]));
  const buckets = new Map<string, { amount: number; count: number }>();

  const bump = (key: string, inv: Investment) => {
    const b = buckets.get(key) || { amount: 0, count: 0 };
    b.amount += inv.amount || 0;
    b.count += 1;
    buckets.set(key, b);
  };

  for (const inv of user.investments || []) {
    const d = inv.date instanceof Date ? inv.date : new Date(inv.date as unknown as string);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    if (inv.customType && customMap.has(inv.customType)) {
      bump(`custom:${inv.customType}`, inv);
    } else {
      bump(inv.type, inv);
    }
  }

  const total = Array.from(buckets.values()).reduce((s, b) => s + b.amount, 0);
  const slices: CategorySlice[] = [];
  for (const [key, v] of buckets) {
    if (key.startsWith('custom:')) {
      const c = customMap.get(key.slice(7))!;
      slices.push({
        key, name: c.name, icon: c.icon, color: c.color,
        amount: v.amount, count: v.count,
        ratio: total > 0 ? v.amount / total : 0, custom: true,
      });
    } else {
      const meta = TYPE_META[key as InvestType];
      slices.push({
        key, name: meta.name, icon: meta.icon, color: meta.color,
        amount: v.amount, count: v.count,
        ratio: total > 0 ? v.amount / total : 0, custom: false,
      });
    }
  }
  return slices.sort((a, b) => b.amount - a.amount);
}

export interface TrendPoint {
  key: string;
  /** 如 "4月" */
  label: string;
  amount: number;
  count: number;
}

/** 近 N 个月投入趋势（含当月，按时间正序） */
export function monthlyTrend(user: UserProfile, months = 6, now: Date = new Date()): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    let amount = 0;
    let count = 0;
    for (const inv of user.investments || []) {
      const id = inv.date instanceof Date ? inv.date : new Date(inv.date as unknown as string);
      if (id.getFullYear() === y && id.getMonth() === m) {
        amount += inv.amount || 0;
        count++;
      }
    }
    points.push({ key: `${y}-${m + 1}`, label: `${m + 1}月`, amount, count });
  }
  return points;
}
