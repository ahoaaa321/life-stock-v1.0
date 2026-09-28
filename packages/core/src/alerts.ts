// ============ 成长指数预警线（本地计算） ============
import type { PriceAlert } from './types';

export interface AlertEvalResult {
  /** 更新后的预警状态（需持久化） */
  alert: PriceAlert;
  /** 本次是否新触及目标位（用于庆祝提示） */
  targetNew: boolean;
  /** 本次是否新跌破支撑位 */
  floorNew: boolean;
}

/**
 * 依据当前指数评估预警线。
 * 穿越即标记命中；当价格重新回到线内时自动复位，下次穿越可再次提示。
 * @param price 当前成长指数（点）
 */
export function evaluateAlert(price: number, alert: PriceAlert = {}): AlertEvalResult {
  const next: PriceAlert = { ...alert };
  let targetNew = false;
  let floorNew = false;

  if (typeof next.target === 'number' && next.target > 0) {
    const hit = price >= next.target;
    targetNew = hit && !next.targetHit;
    next.targetHit = hit;
  } else {
    next.targetHit = false;
  }

  if (typeof next.floor === 'number' && next.floor > 0) {
    const hit = price <= next.floor;
    floorNew = hit && !next.floorHit;
    next.floorHit = hit;
  } else {
    next.floorHit = false;
  }

  return { alert: next, targetNew, floorNew };
}
