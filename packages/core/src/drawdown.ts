// ============ 回撤复盘 ============
import type { KlinePoint, UserProfile } from './types';

export interface DrawdownInfo {
  /** 峰值指数 */
  peak: number;
  /** 当前指数 */
  current: number;
  /** 回撤幅度（百分比，正数表示回落） */
  drawdownPct: number;
  /** 回撤点数 */
  drawdownPoints: number;
  /** 峰值距今天数 */
  peakDaysAgo: number;
  /** 是否处于回撤中 */
  inDrawdown: boolean;
  /** 归因建议 */
  suggestions: string[];
}

/** 计算当前回撤状态 */
export function calcDrawdown(kline: KlinePoint[], currentPrice: number): DrawdownInfo {
  if (kline.length === 0) {
    return {
      peak: currentPrice, current: currentPrice,
      drawdownPct: 0, drawdownPoints: 0, peakDaysAgo: 0,
      inDrawdown: false, suggestions: ['开始记录你的第一笔成长投入吧'],
    };
  }

  const peak = Math.max(...kline.map((k) => k.price), currentPrice);
  const drawdownPoints = Math.max(0, peak - currentPrice);
  const drawdownPct = peak > 0 ? (drawdownPoints / peak) * 100 : 0;

  // 峰值出现在哪个年龄（近似天数）
  const peakPoint = kline.reduce((max, k) => (k.price > max.price ? k : max), kline[0]);
  const nowAge = kline[kline.length - 1].age;
  const peakDaysAgo = Math.round((nowAge - peakPoint.age) * 365);

  const suggestions: string[] = [];
  if (drawdownPct === 0) {
    suggestions.push('当前处于历史高位，继续保持成长节奏');
  } else if (drawdownPct < 5) {
    suggestions.push('小幅波动属正常，不必过度焦虑');
    suggestions.push('检查近期投入是否连续，保持每周一笔');
  } else if (drawdownPct < 15) {
    suggestions.push('阶段性回落，可复盘近期是否有停滞期');
    suggestions.push('健康与学习时长对成长系数影响较大');
  } else {
    suggestions.push('回落幅度较大，建议认真复盘近期生活变化');
    suggestions.push('可在「记录挫折」中标记事件，帮助归因');
  }

  return {
    peak,
    current: currentPrice,
    drawdownPct: Math.round(drawdownPct * 10) / 10,
    drawdownPoints: Math.round(drawdownPoints),
    peakDaysAgo: Math.max(0, peakDaysAgo),
    inDrawdown: drawdownPct > 0.5,
    suggestions,
  };
}

/** 生成复盘问题（根据回撤原因） */
export function getReviewQuestions(user: UserProfile): string[] {
  const questions: string[] = [
    '最近哪件事最影响你的状态？',
    '这个阶段你的投入重心放在了哪里？',
    '有什么是你想调整或继续的？',
  ];
  if (user.setbacks && user.setbacks.length > 0) {
    questions.unshift('你记录的挫折事件，现在回看有什么新感悟？');
  }
  return questions;
}
