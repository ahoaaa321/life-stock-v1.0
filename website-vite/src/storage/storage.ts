import type { UserProfile } from '@life-stock/core';
import { migrate, withVersion } from '@life-stock/core';
import { storage } from './adapter';

const STORAGE_KEY = 'lifeStockUser';
const DISCLAIMER_KEY = 'disclaimerConfirmed';
const PRIVACY_KEY = 'privacyConsent'; // F12 隐私授权（基础本地数据）
const SENSITIVE_KEY = 'sensitiveConsent'; // 敏感信息（收入、负债、金额等）单独同意

// ============ 用户数据存储 ============

/** JSON 反序列化后把各日期字段复活为 Date（v1.3 起含习惯/待办/事件） */
function reviveDates(user: UserProfile): UserProfile {
  user.investments = (user.investments || []).map((i) => ({ ...i, date: new Date(i.date as unknown as string) }));
  if (user.setbacks) {
    user.setbacks = user.setbacks.map((s) => ({ ...s, date: new Date(s.date as unknown as string) }));
  }
  if (user.journals) {
    user.journals = user.journals.map((j) => ({ ...j, date: new Date(j.date as unknown as string) }));
  }
  if (user.habits) {
    user.habits = user.habits.map((h) => ({ ...h, createdAt: new Date(h.createdAt as unknown as string) }));
  }
  if (user.todos) {
    user.todos = user.todos.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt as unknown as string),
      doneAt: t.doneAt ? new Date(t.doneAt as unknown as string) : undefined,
    }));
  }
  if (user.lifeEvents) {
    user.lifeEvents = user.lifeEvents.map((e) => ({ ...e, date: new Date(e.date as unknown as string) }));
  }
  if (user.enhancedSurvey?.completedAt) {
    user.enhancedSurvey = {
      ...user.enhancedSurvey,
      completedAt: new Date(user.enhancedSurvey.completedAt as unknown as string),
    };
  }
  return user;
}

export function saveUser(user: UserProfile): void {
  storage.set(STORAGE_KEY, JSON.stringify(user));
}

export function loadUser(): UserProfile | null {
  const saved = storage.get(STORAGE_KEY);
  if (!saved) return null;
  try {
    const raw = JSON.parse(saved) as UserProfile & { version?: string };
    // 版本迁移
    return reviveDates(migrate(raw, raw.version));
  } catch {
    return null;
  }
}

export function clearUser(): void {
  storage.remove(STORAGE_KEY);
}

// ============ F12 隐私授权与数据删除 ============

export function isPrivacyConsented(): boolean {
  return storage.get(PRIVACY_KEY) === '1';
}

export function setPrivacyConsent(): void {
  storage.set(PRIVACY_KEY, '1');
}

/** 是否已单独同意收集敏感信息（收入、负债、具体金额等） */
export function isSensitiveConsented(): boolean {
  return storage.get(SENSITIVE_KEY) === '1';
}

export function setSensitiveConsent(consented: boolean): void {
  if (consented) storage.set(SENSITIVE_KEY, '1');
  else storage.remove(SENSITIVE_KEY);
}

/** 删除全部数据（本地 + 免责声明 + 隐私授权） */
export function deleteAllData(): void {
  storage.clear();
}

// ============ 免责声明 ============

export function isDisclaimerConfirmed(): boolean {
  return storage.get(DISCLAIMER_KEY) === '1';
}

export function confirmDisclaimer(): void {
  storage.set(DISCLAIMER_KEY, '1');
}

// ============ JSON 导入/导出 ============

export function exportUser(user: UserProfile): void {
  // v1.2：导出附加版本号与免责声明
  const data = {
    ...withVersion(user),
    exportTime: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `life-index-${user.age}岁-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importUser(json: string): UserProfile {
  const data = JSON.parse(json) as UserProfile & { version?: string };
  if (!data.age || !data.history) throw new Error('文件格式不正确');
  return reviveDates(migrate(data, data.version));
}
