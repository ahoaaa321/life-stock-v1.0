/**
 * smart-invest.ts —— 一句话智能记一笔（调研驱动：Q5 自然语言/语音记一笔 55.3%；Q2 录入繁琐 50.0%）
 *
 * 把口语化的一句话解析为 { 金额, 分类, 日期, 描述 }，纯函数、零平台依赖。
 * 例："昨天买了本编程书 80 元" → { amount:80, type:'education', date:昨天, desc:'昨天买了本编程书 80 元' }
 */
import type { InvestType } from './types';

export interface SmartInvestResult {
  /** 解析出的金额（元）；未提及金额为 null（记为 0 元事件） */
  amount: number | null;
  /** 推断的投入分类；无法判断为 null（调用方回退当前选中分类） */
  type: InvestType | null;
  /** 解析出的日期；未提及为 null（调用方用今天） */
  date: Date | null;
  /** 建议描述：保留用户原话（截断 40 字） */
  desc: string;
  matched: { amount: boolean; type: boolean; date: boolean };
}

/** 分类关键词（命中数打分，平分时按数组先后优先级） */
const TYPE_KEYWORDS: { type: InvestType; words: string[] }[] = [
  { type: 'health', words: ['健身', '私教', '体检', '医院', '看病', '挂号', '药', '跑鞋', '跑步鞋', '跑步', '跑了', '公里', '散步', '快走', '骑行', '单车', '运动', '瑜伽', '游泳', '打球', '篮球', '羽毛球', '足球', '健身房', '维生素', '蛋白', '牙医', '推拿', '按摩', '理疗', '心理咨询', '疫苗', '中医'] },
  { type: 'education', words: ['书', '教材', '学费', '培训', '考研', '考公', '考编', '网课', '课程', '报名', '考试', '雅思', '托福', '学位', '补习', '辅导', '文献', '论文', '字典', '习题', '入学', '函授', '自考'] },
  { type: 'skill', words: ['编程', '代码', '设计', '英语', '日语', '韩语', '外语', '证书', '考证', 'ppt', 'PPT', 'excel', 'Excel', '剪辑', '摄影', '乐器', '吉他', '钢琴', '驾照', '讲座', '沙龙', '工作坊', '训练营', 'python', 'Python', 'java', 'Java'] },
  { type: 'network', words: ['请客', '送礼', '礼物', '红包', '随礼', '社交', '聚会', '团建', '朋友吃饭', '请人', '人情'] },
  { type: 'entertainment', words: ['电影', '游戏', '演唱会', '旅游', '旅行', '门票', '会员', '剧本杀', '密室', '酒吧', 'ktv', 'KTV', '奶茶', '零食', '综艺', '视频网站', '周边', '手办'] },
];

/** 从文本提取金额（元），支持 万/千/百/元/块 */
export function parseAmount(text: string): number | null {
  // x.xx 万/w（中文"万"后不用 \b：JS 正则的 \w 不含中文，边界会失效）
  let m = text.match(/(\d+(?:\.\d+)?)\s*(?:万|[wW])(?![A-Za-z0-9.])/);
  if (m) return Math.round(Number(m[1]) * 10000);
  // x 千/k
  m = text.match(/(\d+(?:\.\d+)?)\s*(?:千|[kK])(?![A-Za-z0-9.])/);
  if (m) return Math.round(Number(m[1]) * 1000);
  // x 百
  m = text.match(/(\d+(?:\.\d+)?)\s*百/);
  if (m) return Math.round(Number(m[1]) * 100);
  // 带单位的元/块/¥
  m = text.match(/(\d+(?:\.\d+)?)\s*(?:元|块钱|块|圆|RMB|rmb|¥|￥)/);
  if (m) return Math.round(Number(m[1]) * 100) / 100;
  // 裸数字（取第一个）：先剔除日期表达，避免把"10月5日"当成 10 元
  const noDate = text
    .replace(/\d{1,2}\s*月\s*\d{1,2}\s*[日号]?/g, ' ')
    .replace(/(?<![\d月])\d{1,2}\s*[日号](?!\d)/g, ' ');
  m = noDate.match(/(?<![\d.])(\d+(?:\.\d+)?)(?![\d.])/);
  if (m) {
    const v = Number(m[1]);
    if (v > 0) return Math.round(v * 100) / 100;
  }
  return null;
}

/** 从文本提取相对/绝对日期 */
export function parseRelativeDate(text: string, now: Date = new Date()): Date | null {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (/前天/.test(text)) { d.setDate(d.getDate() - 2); return d; }
  if (/(昨天|昨日|昨晚)/.test(text)) { d.setDate(d.getDate() - 1); return d; }
  if (/(今天|今日|刚刚|刚才|现在)/.test(text)) return d;
  // X月X日/号
  let m = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]?/);
  if (m) {
    const month = Number(m[1]); const day = Number(m[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const cand = new Date(d.getFullYear(), month - 1, day);
      // 若解析出的日期在未来超过 7 天，视为去年
      if ((cand.getTime() - d.getTime()) / 86400000 > 7) cand.setFullYear(d.getFullYear() - 1);
      return cand;
    }
  }
  // 单独 X日/号（本月）
  m = text.match(/(?<![\d月])(\d{1,2})\s*[日号](?!\d)/);
  if (m) {
    const day = Number(m[1]);
    if (day >= 1 && day <= 31) {
      const cand = new Date(d.getFullYear(), d.getMonth(), day);
      if ((cand.getTime() - d.getTime()) / 86400000 > 7) cand.setMonth(d.getMonth() - 1);
      return cand;
    }
  }
  return null;
}

/** 关键词打分推断分类（中文多字词权重高于单字，平分时按 health>education>… 优先级） */
export function parseType(text: string): InvestType | null {
  let best: { type: InvestType; score: number } | null = null;
  for (const { type, words } of TYPE_KEYWORDS) {
    let score = 0;
    for (const w of words) if (text.includes(w)) score += w.length >= 2 ? 2 : 1;
    if (score > 0 && (!best || score > best.score)) best = { type, score };
  }
  return best ? best.type : null;
}

/** 一句话解析主入口 */
export function smartParseInvest(input: string, now: Date = new Date()): SmartInvestResult {
  const text = (input || '').trim();
  const amount = parseAmount(text);
  const type = parseType(text);
  const date = parseRelativeDate(text, now);
  return {
    amount,
    type,
    date,
    desc: text.length > 40 ? text.slice(0, 40) : text,
    matched: { amount: amount !== null, type: type !== null, date: date !== null },
  };
}
