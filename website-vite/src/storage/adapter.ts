/**
 * 跨端存储适配层
 *
 * Web 端：localStorage
 * 小程序端：wx.setStorageSync / 云数据库（可选）
 *
 * 所有存储操作必须经此接口，业务代码不得直接调用平台 API。
 */
export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  /** 删除全部数据（隐私合规要求） */
  clear(): void;
}

/** Web 端基于 localStorage 的实现 */
export class LocalStorageAdapter implements StorageAdapter {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }
  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  clear(): void {
    localStorage.clear();
  }
}

/** 默认适配器（Web 端） */
export const storage: StorageAdapter = new LocalStorageAdapter();
