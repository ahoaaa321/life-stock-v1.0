// ============ 家庭账本 ============
import type { UserProfile } from './types';

export interface FamilyEntry {
  id: string;
  date: Date;
  amount: number;
  desc: string;
  type: 'support' | 'repay' | 'gift';
}

export interface FamilyLedger {
  /** 累计家庭支持（万元） */
  totalSupport: number;
  /** 明细列表 */
  entries: FamilyEntry[];
  /** 家庭支持占总资本比例 */
  supportRatio: number;
  /** 建议 */
  suggestions: string[];
}

/** 计算家庭账本摘要 */
export function getFamilyLedger(user: UserProfile): FamilyLedger {
  const totalSupport = user.familySupportCapital || 0;
  const entries: FamilyEntry[] = (user as any)._familyEntries || [];

  // 简单估算 BV（与 formula 保持一致逻辑）
  const bv = (user.totalInvest || 0) + totalSupport;
  const supportRatio = bv > 0 ? totalSupport / bv : 0;

  const suggestions: string[] = [];
  if (totalSupport === 0) {
    suggestions.push('可记录家庭/父母的累计投入，更全面地认识成长积累');
  }
  if (supportRatio > 0.5) {
    suggestions.push('家庭支持占比较高，可逐步增加自我投入占比');
  }
  if (supportRatio > 0 && supportRatio <= 0.5) {
    suggestions.push('家庭支持与自我投入比例健康，继续保持');
  }
  if (entries.length === 0 && totalSupport > 0) {
    suggestions.push('可补充家庭投入的明细记录，便于感恩与回顾');
  }

  return {
    totalSupport,
    entries,
    supportRatio: Math.round(supportRatio * 100) / 100,
    suggestions,
  };
}
