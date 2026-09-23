package com.lifestock.constants;

import java.util.*;

/**
 * 人生即股票 - 核心常量
 * 所有参数基于：国家统计局2025数据、育娲人口报告、北大教育财政报告
 */
public class Constants {

    // ============ 股价基础参数 ============
    public static final double IPO_PRICE = 100;            // 发行价（出生时股价）
    public static final int NORMALIZE_K = 1000;            // 归一化系数：1000元 = 1点
    public static final double RANDOM_VOLATILITY = 0.05;   // 随机波动率 ±5%

    // ============ 投入类型权重 ============
    // 数据依据：国家统计局2025消费结构 + 北大教育财政报告
    public enum InvestmentType {
        EDUCATION("教育",     1.5, 10, "🎓"),
        SKILL("技能培训",     1.3, 5,  "📚"),
        HEALTH("健康医疗",    1.1, 3,  "💪"),
        SOCIAL("人脉社交",    1.0, 2,  "🤝"),
        ENTERTAINMENT("娱乐", 0.3, 1,  "🎮"),
        OTHER("其他",         0.5, 2,  "📦");

        public final String label;
        public final double weight;
        public final int halfLife;   // 半衰期（年）
        public final String icon;

        InvestmentType(String label, double weight, int halfLife, String icon) {
            this.label = label;
            this.weight = weight;
            this.halfLife = halfLife;
            this.icon = icon;
        }
    }

    // ============ 人生阶段系数 ============
    // 数据依据：东吴证券2025研报 - 年龄-消费曲线
    public static class LifeStage {
        public final int minAge;
        public final int maxAge;
        public final double coeff;
        public final String label;
        public final String desc;

        public LifeStage(int minAge, int maxAge, double coeff, String label, String desc) {
            this.minAge = minAge;
            this.maxAge = maxAge;
            this.coeff = coeff;
            this.label = label;
            this.desc = desc;
        }
    }

    public static final LifeStage[] LIFE_STAGES = {
        new LifeStage(0, 6,   0.3, "种子轮",  "纯投入期"),
        new LifeStage(6, 12,  0.5, "天使轮",  "基础教育"),
        new LifeStage(12, 18, 0.9, "Pre-IPO", "第一教育消费峰"),
        new LifeStage(18, 25, 1.1, "IPO",     "自身教育第二峰"),
        new LifeStage(25, 35, 1.5, "成长期",  "收入+消费双高峰"),
        new LifeStage(35, 50, 1.3, "成熟期",  "子女教育投入峰"),
        new LifeStage(50, 200, 0.8, "蓝筹股", "消费回落，医疗上升"),
    };

    // ============ 收入分位数系数 ============
    // 数据依据：国家统计局2025五等份收入分组
    public enum IncomeQuintile {
        FAR_BELOW("远低于同龄人", 0.35, 10150),
        BELOW("低于同龄人",       0.65, 22702),
        AVERAGE("和同龄人差不多", 1.0,  36231),
        ABOVE("高于同龄人",       1.55, 55586),
        FAR_ABOVE("远高于同龄人", 2.9,  103778);

        public final String label;
        public final double coeff;
        public final double income;

        IncomeQuintile(String label, double coeff, double income) {
            this.label = label;
            this.coeff = coeff;
            this.income = income;
        }
    }

    // ============ 地区系数 ============
    public enum Region {
        TIER_1("一线城市",    1.8),
        NEW_TIER_1("新一线",  1.4),
        TIER_2("二线城市",    1.1),
        TIER_3("三四线",      0.8),
        RURAL("农村",         0.68);

        public final String label;
        public final double coeff;

        Region(String label, double coeff) {
            this.label = label;
            this.coeff = coeff;
        }
    }

    // ============ 行业PE（市盈率） ============
    public enum Industry {
        INTERNET("互联网/科技", 40),
        FINANCE("金融",         20),
        EDUCATION("教育",       25),
        MEDICAL("医疗健康",     30),
        MANUFACTURING("制造业", 12),
        SERVICE("服务业",       15),
        GOVERNMENT("体制内",    18),
        STUDENT("学生（潜力股）", 50),
        OTHER("其他",           20);

        public final String label;
        public final double pe;

        Industry(String label, double pe) {
            this.label = label;
            this.pe = pe;
        }
    }

    // ============ 0-18岁各年龄段年均支出（全国平均） ============
    // 数据依据：育娲人口《中国生育成本报告2024》
    public static final double[] AGE_EXPENSE = {
        24538, 24538, 24538,   // 0-2岁
        36538, 36538, 36538,   // 3-5岁
        27007, 27007, 27007, 27007, 27007, 27007, 27007, 27007, 27007,  // 6-14岁
        29007, 29007, 29007,   // 15-17岁
        35000                   // 18岁（大学估算）
    };

    // ============ 分学段教育支出（年均） ============
    // 数据依据：北大《中国教育财政家庭调查报告2023》
    public static class EduStage {
        public final String label;
        public final int minAge;
        public final int maxAge;
        public final double expense;

        public EduStage(String label, int minAge, int maxAge, double expense) {
            this.label = label;
            this.minAge = minAge;
            this.maxAge = maxAge;
            this.expense = expense;
        }
    }

    public static final EduStage[] EDUCATION_BY_STAGE = {
        new EduStage("学前",  3, 5,  7826),
        new EduStage("小学",  6, 11, 4651),
        new EduStage("初中",  12, 14, 6891),
        new EduStage("高中",  15, 17, 13346),
        new EduStage("大学",  18, 21, 29135),
    };
}
