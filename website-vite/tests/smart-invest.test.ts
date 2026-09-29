import { describe, it, expect } from 'vitest';
import { parseAmount, parseRelativeDate, parseType, smartParseInvest } from '@life-stock/core';

describe('parseAmount 金额解析', () => {
  it('元/块/¥ 单位', () => {
    expect(parseAmount('花了80元')).toBe(80);
    expect(parseAmount('买书 80 块钱')).toBe(80);
    expect(parseAmount('奶茶15.5块')).toBe(15.5);
    expect(parseAmount('¥200')).toBe(200);
  });
  it('万/千/百 中文单位', () => {
    expect(parseAmount('学费1.2万')).toBe(12000);
    expect(parseAmount('私教3千')).toBe(3000);
    expect(parseAmount('培训费5百')).toBe(500);
    expect(parseAmount('花了2k')).toBe(2000);
  });
  it('裸数字', () => {
    expect(parseAmount('今天买书 80')).toBe(80);
  });
  it('日期数字不被误识别为金额', () => {
    expect(parseAmount('10月5日去跑步')).toBeNull();
    expect(parseAmount('3号看了场电影')).toBeNull();
  });
  it('日期与金额同时出现时取金额', () => {
    expect(parseAmount('10月5日买书80元')).toBe(80);
  });
  it('无数字返回 null', () => {
    expect(parseAmount('今天去跑了步')).toBeNull();
  });
});

describe('parseType 分类推断', () => {
  it('关键词打分：长词权重更高', () => {
    // "编程"(2分) 权重高于 "书"(1分) → 判为技能
    expect(parseType('买了本编程书')).toBe('skill');
    expect(parseType('买了本关于设计的书')).toBe('skill'); // 设计2 分 vs 书1 分
  });
  it('健康类', () => {
    expect(parseType('办了张健身卡')).toBe('health');
    expect(parseType('去医院看病挂号')).toBe('health');
  });
  it('教育类明确词', () => {
    expect(parseType('交了考研网课学费')).toBe('education');
  });
  it('技能类', () => {
    expect(parseType('报名英语训练营')).toBe('skill');
    expect(parseType('考了个驾照')).toBe('skill');
  });
  it('人脉/娱乐', () => {
    expect(parseType('朋友聚会请客吃饭')).toBe('network');
    expect(parseType('周末看电影买会员')).toBe('entertainment');
  });
  it('无法判断返回 null', () => {
    expect(parseType('随便花了点钱')).toBeNull();
  });
});

describe('parseRelativeDate 日期解析', () => {
  const now = new Date(2026, 8, 28); // 2026-09-28
  it('今天/昨天/前天', () => {
    expect(parseRelativeDate('今天买书', now)?.getDate()).toBe(28);
    expect(parseRelativeDate('昨天健身', now)?.getDate()).toBe(27);
    expect(parseRelativeDate('前天上课', now)?.getDate()).toBe(26);
  });
  it('X月X日；未来日期归为去年/上月', () => {
    const d1 = parseRelativeDate('10月5日旅游', now)!;
    expect(d1.getMonth()).toBe(9); expect(d1.getDate()).toBe(5); expect(d1.getFullYear()).toBe(2026);
    const d2 = parseRelativeDate('12月20日报名', now)!; // 未来 → 去年
    expect(d2.getFullYear()).toBe(2025);
    const d3 = parseRelativeDate('9月30号聚餐', now)!;  // 近未来 2 天，保留本月
    expect(d3.getMonth()).toBe(8); expect(d3.getDate()).toBe(30);
  });
  it('无日期返回 null', () => {
    expect(parseRelativeDate('买了本书')).toBeNull();
  });
});

describe('smartParseInvest 综合解析', () => {
  const now = new Date(2026, 8, 28);
  it('典型完整句', () => {
    const r = smartParseInvest('昨天买了本考研英语真题 58 元', now);
    expect(r.amount).toBe(58);
    expect(r.date?.getDate()).toBe(27);
    expect(r.matched.amount).toBe(true);
    expect(r.matched.date).toBe(true);
    expect(r.desc).toContain('昨天');
  });
  it('只有事件没有金额', () => {
    const r = smartParseInvest('今天去操场跑了五公里', now);
    expect(r.amount).toBeNull();
    expect(r.type).toBe('health');
    expect(r.matched.type).toBe(true);
  });
  it('空输入安全', () => {
    const r = smartParseInvest('   ', now);
    expect(r.amount).toBeNull(); expect(r.type).toBeNull(); expect(r.date).toBeNull();
  });
});
