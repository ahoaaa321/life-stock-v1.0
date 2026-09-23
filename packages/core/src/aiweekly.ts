// ============ AI 周报（规则式，无后端依赖） ============
import type { UserProfile } from './types';
import { calculateStock } from './formula';
import { countJournalsInDays, getAvgMood, getJournalStreak } from './journal';
import { getWeeklyStatus } from './weekly';
import { calcRadar } from './radar';

export interface AIWeeklyReport {
  week: string;
  /** 本周一句话总结 */
  summary: string;
  /** 亮点 */
  highlights: string[];
  /** 待改进 */
  improvements: string[];
  /** 下周行动建议 */
  actions: string[];
  /** 情绪趋势 */
  moodNote: string;
}

/** 生成本周 AI 周报（规则引擎，不调用任何外部 API） */
export function generateAIWeeklyReport(user: UserProfile): AIWeeklyReport {
  const now = new Date();
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(now.getDate() + diff);
  const week = `${weekStart.getFullYear()}年${weekStart.getMonth() + 1}月第${Math.ceil(weekStart.getDate() / 7)}周`;

  const snap = calculateStock(user);
  const weekly = getWeeklyStatus(user);
  const journalCount = countJournalsInDays(user, 7);
  const journalStreak = getJournalStreak(user);
  const avgMood = getAvgMood(user, 7);
  const radar = calcRadar(user);

  const highlights: string[] = [];
  const improvements: string[] = [];
  const actions: string[] = [];

  // 投入
  if (weekly.investedThisWeek) {
    highlights.push(`本周记录了 ${weekly.countThisWeek} 笔投入${weekly.streakWeeks > 1 ? `，连续 ${weekly.streakWeeks} 周` : ''}`);
  } else {
    improvements.push('本周还没有记录投入，下周至少记一笔');
    actions.push('周末前记录一笔自我投入');
  }

  // 记录频率
  if (journalCount >= 5) {
    highlights.push(`本周记录了 ${journalCount} 条成长感悟，觉察力在线`);
  } else if (journalCount >= 1) {
    actions.push(`下周把记录频率提升到 3 次以上`);
  } else {
    improvements.push('本周没有成长记录，觉察是成长的第一步');
    actions.push('每天花 1 分钟写下一个想法');
  }

  // 情绪
  let moodNote = '本周无情绪数据';
  if (avgMood !== null) {
    if (avgMood >= 3.5) {
      highlights.push('本周整体情绪很好，状态饱满');
      moodNote = '😄 情绪很好，继续保持';
    } else if (avgMood >= 2.5) {
      moodNote = '🙂 情绪平稳';
    } else {
      improvements.push('本周情绪偏低，关注休息与健康');
      moodNote = '😔 情绪偏低，多关注自己';
      actions.push('安排一次放松或运动');
    }
  }

  // 结构均衡
  if (radar.balance >= 0.6) {
    highlights.push('投入结构较均衡，多维发展');
  } else {
    const weakLabel = radar.dimensions.find((d) => d.type === radar.weakest)?.label || '';
    improvements.push(`投入结构不均衡，${weakLabel}维度较弱`);
    actions.push(`下周在${weakLabel}上增加一点投入`);
  }

  // 指数趋势（简化：用成长系数判断）
  if (snap.growthCoef >= 1.2) {
    highlights.push('成长动力强劲，保持当前节奏');
  } else if (snap.growthCoef < 0.9) {
    improvements.push('成长动力偏弱，检查学习时长与健康');
    actions.push('增加每周学习时长，关注健康评分');
  }

  // 总结
  let summary: string;
  if (highlights.length >= 2) {
    summary = '本周成长势头良好，继续保持多维投入与觉察。';
  } else if (improvements.length >= 2) {
    summary = '本周有提升空间，从小行动开始调整节奏。';
  } else {
    summary = '本周平稳，保持觉察，持续积累。';
  }

  if (actions.length === 0) {
    actions.push('保持当前节奏，下周复盘时看看有什么新变化');
  }

  return { week, summary, highlights, improvements, actions, moodNote };
}
