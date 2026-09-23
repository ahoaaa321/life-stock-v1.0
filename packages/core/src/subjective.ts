import type { UserProfile } from './types';

/** 主观感知权重范围 */
export const SUBJECTIVE_MIN = 0.5;
export const SUBJECTIVE_MAX = 1.5;
export const SUBJECTIVE_DEFAULT = 1.0;

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * 主观感知权重（0.5~1.5）
 *
 * 用户对自身成长价值的主观评估，完全由用户驱动，不硬编码默认偏见。
 * - 未设置时返回中性值 1.0（不放大也不缩小）
 * - 由用户在"校准指数"中主动调整
 *
 * 设计原则：默认值中性，避免算法替用户做价值判断。
 */
export function calcSubjectiveAdjust(user: UserProfile): number {
  if (user.subjectiveWeight === undefined || user.subjectiveWeight === null) {
    return SUBJECTIVE_DEFAULT;
  }
  return clamp(user.subjectiveWeight, SUBJECTIVE_MIN, SUBJECTIVE_MAX);
}

/**
 * 设置主观权重（带边界裁剪）
 * 返回裁剪后的值，供 UI 回显
 */
export function setSubjectiveWeight(value: number): number {
  return clamp(value, SUBJECTIVE_MIN, SUBJECTIVE_MAX);
}
