import type { UserProfile } from './types';
import { FORMULA_VERSION } from './constants';

/**
 * 数据版本迁移
 * 当公式参数变更时，旧版本数据可通过此函数升级到当前版本结构。
 *
 * v1.1 → v1.2：
 *  - 新增 familySupportCapital 字段（默认 0）
 *  - 新增 version 字段
 */
export function migrate(user: UserProfile, fromVersion?: string): UserProfile {
  let result = { ...user };

  // v1.1 及更早：补充 familySupportCapital
  if (!fromVersion || fromVersion < '1.2') {
    if (result.familySupportCapital === undefined) {
      result.familySupportCapital = 0;
    }
  }

  // 统一打上当前版本号
  result.version = FORMULA_VERSION;
  return result;
}

/**
 * 为导出数据附加版本号与免责声明
 */
export function withVersion(user: UserProfile): UserProfile & { version: string; disclaimer: string } {
  return {
    ...user,
    version: FORMULA_VERSION,
    disclaimer:
      '本工具为个人成长记录与自我反思工具，所有数值为模型估算，仅供娱乐与自我观察，不构成理财、职业或心理咨询建议，也不预测收入。',
  };
}
