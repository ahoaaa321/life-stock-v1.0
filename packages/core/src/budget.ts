// ============ 月度预算 ============
import type { UserProfile, Investment } from './types';

/** 月份 key：yyyy-MM（month 0-based） */
export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

/** 取某月投入汇总（金额合计与笔数） */
export function getMonthSummary(investments: Investment[], year: number, month: number): {
  amount: number;
  count: number;
} {
  let amount = 0;
  let count = 0;
  for (const inv of investments) {
    const d = inv.date instanceof Date ? inv.date : new Date(inv.date as unknown as string);
    if (d.getFullYear() === year && d.getMonth() === month) {
      amount += inv.amount || 0;
      count++;
    }
  }
  return { amount, count };
}

export interface BudgetStatus {
  /** amount=按金额，count=按笔数（未授权敏感金额时） */
  mode: 'amount' | 'count';
  budget: number | null;
  /** 本月已发生（金额或笔数） */
  spent: number;
  /** 预算剩余（超支为负） */
  remaining: number | null;
  /** 0~1+，无预算为 null */
  ratio: number | null;
  overrun: boolean;
  /** 本月日均（金额模式：元/天；笔数模式：笔/天） */
  dailyAvg: number;
  /** 上月同期值 */
  lastMonth: number;
  /** 相比上月变化百分比（上月为 0 时 null） */
  deltaPct: number | null;
}

/**
 * @param sensitive 是否已授权金额信息
 */
export function getBudgetStatus(
  user: UserProfile,
  opts: { now?: Date; sensitive: boolean },
): BudgetStatus {
  const now = opts.now || new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const cur = getMonthSummary(user.investments || [], year, month);
  const prevDate = new Date(year, month - 1, 1);
  const prev = getMonthSummary(user.investments || [], prevDate.getFullYear(), prevDate.getMonth());

  const useAmount = opts.sensitive && (user.monthlyBudget ?? 0) > 0;
  const useCount = !opts.sensitive && (user.monthlyCountBudget ?? 0) > 0;
  const budget = useAmount ? user.monthlyBudget! : useCount ? user.monthlyCountBudget! : null;
  const mode = useAmount ? 'amount' : 'count';
  const spent = mode === 'amount' ? cur.amount : cur.count;
  const lastMonth = mode === 'amount' ? prev.amount : prev.count;
  const dayOfMonth = now.getDate();

  return {
    mode,
    budget,
    spent,
    remaining: budget === null ? null : budget - spent,
    ratio: budget === null ? null : spent / budget,
    overrun: budget !== null && spent > budget,
    dailyAvg: dayOfMonth > 0 ? spent / dayOfMonth : 0,
    lastMonth,
    deltaPct: lastMonth > 0 ? (spent - lastMonth) / lastMonth : null,
  };
}
