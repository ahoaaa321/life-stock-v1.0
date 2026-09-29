import { describe, it, expect } from 'vitest';
import {
  createRecoveryPlan, toggleInstant, toggleRecoveryTask, getRecoveryProgress,
  getActiveRecoveryPlan, upsertRecoveryPlan, RECOVERY_KITS,
} from '@life-stock/core';
import type { UserProfile } from '@life-stock/core';

const baseUser = {} as UserProfile;

describe('recovery 恢复计划', () => {
  it('四种挫折类型都有完整内容包（共情语/即时行动/7天内任务/庆祝语）', () => {
    for (const kind of ['jobloss', 'illness', 'loss', 'stagnate'] as const) {
      const kit = RECOVERY_KITS[kind];
      expect(kit.empathy.length).toBeGreaterThan(5);
      expect(kit.instant.length).toBeGreaterThan(5);
      expect(kit.tasks.length).toBeGreaterThanOrEqual(5);
      expect(kit.tasks.length).toBeLessThanOrEqual(7);
      expect(kit.completeCheer.length).toBeGreaterThan(5);
      for (const t of kit.tasks) expect(t.day).toBeGreaterThanOrEqual(1);
    }
  });

  it('createRecoveryPlan 生成即时行动+任务清单，初始均未完成', () => {
    const p = createRecoveryPlan('stagnate', 8, 612);
    expect(p.setbackType).toBe('stagnate');
    expect(p.severity).toBe(8);
    expect(p.indexBefore).toBe(612);
    expect(p.instantDone).toBe(false);
    expect(p.tasks.length).toBeGreaterThanOrEqual(5);
    expect(p.tasks.every((t) => !t.done)).toBe(true);
    expect(p.completedAt).toBeUndefined();
    expect(p.id).toMatch(/^rp_/);
    expect(p.tasks[0].id).toMatch(/^rt_/);
  });

  it('严重度被夹在 1~10', () => {
    expect(createRecoveryPlan('loss', 99, 100).severity).toBe(10);
    expect(createRecoveryPlan('loss', -5, 100).severity).toBe(1);
  });

  it('toggleInstant 勾选即时行动后进度 +1，再勾取消', () => {
    let p = createRecoveryPlan('jobloss', 5, 500);
    const total = p.tasks.length + 1;
    p = toggleInstant(p);
    expect(p.instantDone).toBe(true);
    expect(p.instantDoneAt).toBeTruthy();
    expect(getRecoveryProgress(p)).toMatchObject({ done: 1, total, pct: Math.round(100 / total) });
    p = toggleInstant(p);
    expect(p.instantDone).toBe(false);
    expect(p.instantDoneAt).toBeUndefined();
    expect(getRecoveryProgress(p).done).toBe(0);
  });

  it('全部任务+即时行动完成时自动标记 completedAt，取消任一则撤销', () => {
    let p = createRecoveryPlan('illness', 6, 480);
    p = toggleInstant(p);
    for (const t of p.tasks) p = toggleRecoveryTask(p, t.id);
    expect(p.completedAt).toBeTruthy();
    expect(getRecoveryProgress(p).finished).toBe(true);
    // 取消一个任务
    p = toggleRecoveryTask(p, p.tasks[0].id);
    expect(p.completedAt).toBeUndefined();
    expect(getRecoveryProgress(p).finished).toBe(false);
  });

  it('upsertRecoveryPlan 同 id 覆盖、新 id 追加；getActiveRecoveryPlan 返回最新未完成', () => {
    let u = { ...baseUser };
    const p1 = createRecoveryPlan('stagnate', 3, 400);
    u = upsertRecoveryPlan(u, p1);
    expect(u.recoveryPlans).toHaveLength(1);
    // 完成 p1
    let done = toggleInstant(p1);
    for (const t of done.tasks) done = toggleRecoveryPlan_task(done, t.id);
    u = upsertRecoveryPlan(u, done);

    // 已完成 → 无活动计划
    expect(getActiveRecoveryPlan(u)).toBeNull();

    // 新增一份未完成
    const p2 = createRecoveryPlan('jobloss', 7, 420);
    u = upsertRecoveryPlan(u, p2);
    expect(getActiveRecoveryPlan(u)?.id).toBe(p2.id);
  });
});

// 小辅助：循环勾选
function toggleRecoveryPlan_task(p: ReturnType<typeof createRecoveryPlan>, id: string) {
  return toggleRecoveryTask(p, id);
}
