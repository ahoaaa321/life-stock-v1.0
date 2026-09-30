// ============ 种子体验官邀请码（首批内测，共 5 人） ============
import type { UserProfile } from './types';

/** 有效邀请码（大写、去空格、连字符可省略） */
export const SEED_CODES: string[] = [
  'GROWTH-01',
  'GROWTH-02',
  'GROWTH-03',
  'GROWTH-04',
  'GROWTH-05',
];

/** 规范化用户输入：去空格、转大写、统一连字符 */
export function normalizeSeedCode(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[—–_]/g, '-');
}

export type RedeemResult =
  | { ok: true; user: UserProfile }
  | { ok: false; reason: 'empty' | 'invalid' | 'already' };

/**
 * 校验并激活邀请码（纯函数，返回新 user）
 * - empty：输入为空
 * - invalid：邀请码不存在
 * - already：已经是种子体验官
 */
export function redeemSeedCode(
  user: UserProfile,
  rawCode: string,
  now: Date = new Date(),
): RedeemResult {
  const code = normalizeSeedCode(rawCode);
  if (!code) return { ok: false, reason: 'empty' };
  if (user.seedTester) return { ok: false, reason: 'already' };
  if (!SEED_CODES.includes(code)) return { ok: false, reason: 'invalid' };
  return {
    ok: true,
    user: {
      ...user,
      seedTester: true,
      seedCode: code,
      seedActivatedAt: now.toISOString(),
    },
  };
}
