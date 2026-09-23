// ============ 虚拟导师（规则引擎，无后端） ============
import type { UserProfile } from './types';
import { calculateStock } from './formula';
import { calcRadar } from './radar';

export interface MentorAdvice {
  /** 导师人设 */
  persona: string;
  /** 开场问候 */
  greeting: string;
  /** 观察到的情况 */
  observations: string[];
  /** 具体建议 */
  advices: string[];
  /** 鼓励语 */
  encouragement: string;
}

const PERSONAS = [
  { name: '成长教练', tone: '理性鼓励' },
  { name: '职场前辈', tone: '务实建议' },
  { name: '生活哲学家', tone: '温柔启发' },
];

/** 生成虚拟导师建议 */
export function getMentorAdvice(user: UserProfile): MentorAdvice {
  const snap = calculateStock(user);
  const radar = calcRadar(user);
  const persona = PERSONAS[new Date().getDate() % PERSONAS.length];

  const observations: string[] = [];
  const advices: string[] = [];

  // 观察
  if (snap.growthCoef >= 1.2) {
    observations.push('你的成长动力很强，学习与投入节奏不错');
  } else if (snap.growthCoef < 0.9) {
    observations.push('近期成长动力偏弱，可能需要调整节奏');
  } else {
    observations.push('成长节奏平稳，稳扎稳打');
  }

  if (user.healthScore >= 80) {
    observations.push('健康状态良好，这是持续成长的底座');
  } else if (user.healthScore < 60) {
    observations.push('健康评分偏低，身体是一切的基础');
  }

  if (radar.balance >= 0.6) {
    observations.push('投入结构均衡，多维发展');
  } else {
    const weak = radar.dimensions.find((d) => d.type === radar.weakest)?.label.split(' ')[1] || '';
    observations.push(`${weak}维度投入相对较少`);
  }

  // 建议
  if (user.studyHours < 5) {
    advices.push('尝试每周增加 2-3 小时学习时间，成长系数会明显提升');
  }
  if (user.healthScore < 70) {
    advices.push('安排规律运动和睡眠，健康评分每提升 10 分，质量系数约提升 7%');
  }
  if (radar.balance < 0.5) {
    advices.push('在保持优势维度的同时，给薄弱维度一些投入，结构会更稳');
  }
  if (snap.subjectiveAdjust < 1.0) {
    advices.push('你对自己的评价偏保守，不妨多看看已取得的进步');
  }
  if (advices.length === 0) {
    advices.push('当前状态不错，给自己设定一个稍高的目标，然后稳步推进');
  }

  // 鼓励语
  const encouragements = [
    '成长不是百米冲刺，而是马拉松。你已经在路上了。',
    '每一笔投入、每一次觉察，都在塑造未来的你。',
    '不必和别人比，今天的你比昨天好一点，就是胜利。',
    '低谷是蓄力，高峰是收获。享受这个过程。',
  ];
  const encouragement = encouragements[new Date().getDay() % encouragements.length];

  // 问候
  const hour = new Date().getHours();
  let greeting: string;
  if (hour < 6) greeting = '夜深了，注意休息。';
  else if (hour < 12) greeting = '早上好，新的一天开始了。';
  else if (hour < 18) greeting = '下午好，今天过得怎么样？';
  else greeting = '晚上好，回顾一下今天的成长吧。';

  return {
    persona: `${persona.name}（${persona.tone}）`,
    greeting,
    observations,
    advices,
    encouragement,
  };
}
