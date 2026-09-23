// ============ 感恩卡片（亲子连接，纯本地生成） ============
import type { UserProfile } from './types';

export interface GratitudeCard {
  /** 卡片标题 */
  title: string;
  /** 正文 */
  content: string;
  /** 署名 */
  signature: string;
}

const TEMPLATES = [
  {
    title: '致支持我的家人',
    content: '谢谢你们一直以来的支持和陪伴。我正在认真生活、持续成长，每一点进步都有你们的功劳。我会照顾好自己，也会努力成为更好的人。',
  },
  {
    title: '给爸爸妈妈的一封信',
    content: '这些年辛苦了。我知道成长不是一件容易的事，而你们的爱是我最坚实的后盾。我会好好珍惜自己，也会常回家看看。',
  },
  {
    title: '感恩有你',
    content: '感谢你在我成长路上的每一份付出。也许我不常说，但我都记得。我会带着这份爱，继续向前走。',
  },
  {
    title: '我在好好长大',
    content: '请放心，我在认真生活、努力成长。健康、学习、工作，我都在用心经营。谢谢你给我的一切，我会用成长来回报。',
  },
];

/** 生成感恩卡片 */
export function generateGratitudeCard(user: UserProfile, index?: number): GratitudeCard {
  const i = index ?? new Date().getDate() % TEMPLATES.length;
  const tpl = TEMPLATES[i];
  return {
    title: tpl.title,
    content: tpl.content,
    signature: `—— 一个正在成长的人（${user.age} 岁）`,
  };
}

/** 获取所有模板索引 */
export function getGratitudeTemplateCount(): number {
  return TEMPLATES.length;
}
