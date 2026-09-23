package com.lifestock.engine;

import com.lifestock.constants.Constants.InvestmentType;
import com.lifestock.model.Investment;
import com.lifestock.model.UserProfile;

import java.util.*;

/**
 * 扩展里程碑引擎
 * 在基础里程碑之上，增加：
 * 1. 技能型里程碑（证书、语言、编程语言）
 * 2. 随机事件里程碑（好运/坏运，可对冲）
 * 3. 连续型里程碑（坚持天数）
 */
public class ExtendedMilestones {

    /**
     * 技能型里程碑（用户手动确认或上传证书）
     */
    public static class SkillMilestone {
        public final String id;
        public final String name;
        public final String skill;           // 技能关键词
        public final int bonus;              // 股价加成
        public final String icon;

        public SkillMilestone(String id, String name, String skill, int bonus, String icon) {
            this.id = id;
            this.name = name;
            this.skill = skill;
            this.bonus = bonus;
            this.icon = icon;
        }
    }

    public static final SkillMilestone[] SKILL_MILESTONES = {
        new SkillMilestone("pmp",        "PMP项目管理认证",     "PMP",        12, "📋"),
        new SkillMilestone("cpa",        "CPA注册会计师",       "CPA",        20, "💼"),
        new SkillMilestone("cfa",        "CFA金融分析师",       "CFA",        25, "📈"),
        new SkillMilestone("toefl100",   "托福100+",           "英语",        10, "🗣️"),
        new SkillMilestone("ielts7",     "雅思7.0+",           "英语",        10, "🗣️"),
        new SkillMilestone("java_dev",   "Java高级开发认证",    "Java",       8,  "☕"),
        new SkillMilestone("python_dev", "Python数据分析认证",  "Python",     8,  "🐍"),
        new SkillMilestone("driver",     "拿到驾照",            "驾照",        5,  "🚗"),
        new SkillMilestone("cooking",    "高级厨师证",          "烹饪",        3,  "🍳"),
        new SkillMilestone("photo",      "摄影师认证",          "摄影",        4,  "📷"),
    };

    /**
     * 连续型里程碑（坚持天数）
     */
    public static class StreakMilestone {
        public final String id;
        public final String name;
        public final String activity;        // 活动类型
        public final int days;               // 需要坚持的天数
        public final int bonus;
        public final String icon;

        public StreakMilestone(String id, String name, String activity, int days, int bonus, String icon) {
            this.id = id;
            this.name = name;
            this.activity = activity;
            this.days = days;
            this.bonus = bonus;
            this.icon = icon;
        }
    }

    public static final StreakMilestone[] STREAK_MILESTONES = {
        new StreakMilestone("read_100",   "坚持阅读100天",   "阅读",   100,  8,  "📖"),
        new StreakMilestone("read_365",   "坚持阅读365天",   "阅读",   365,  20, "📚"),
        new StreakMilestone("run_100",    "坚持跑步100天",   "跑步",   100,  10, "🏃"),
        new StreakMilestone("run_365",    "坚持跑步365天",   "跑步",   365,  25, "🏆"),
        new StreakMilestone("study_30",   "连续学习30天",    "学习",   30,   5,  "📝"),
        new StreakMilestone("study_100",  "连续学习100天",   "学习",   100,  15, "✍️"),
        new StreakMilestone("meditate_30","连续冥想30天",    "冥想",   30,   6,  "🧘"),
    };

    /**
     * 随机事件里程碑
     * 正向事件（+）和负向事件（-），部分可被之前的投入"对冲"
     */
    public static class RandomEvent {
        public final String id;
        public final String name;
        public final String description;
        public final int minBonus;           // 最小影响（可为负）
        public final int maxBonus;           // 最大影响
        public final InvestmentType hedgeType; // 可对冲的类型（null表示不可对冲）
        public final String icon;

        public RandomEvent(String id, String name, String description,
                          int minBonus, int maxBonus, InvestmentType hedgeType, String icon) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.minBonus = minBonus;
            this.maxBonus = maxBonus;
            this.hedgeType = hedgeType;
            this.icon = icon;
        }
    }

    public static final RandomEvent[] RANDOM_EVENTS = {
        // 正向事件
        new RandomEvent("meet_mentor",   "遇到贵人",     "在关键时刻获得行业前辈指导",      5, 15,  null, "🎁"),
        new RandomEvent("bonus_project", "奖金项目",     "参与高价值项目获得额外收入",      3, 10,  null, "💰"),
        new RandomEvent("viral_content", "内容走红",     "分享的内容获得大量关注",          5, 12,  null, "🔥"),
        new RandomEvent("promotion",     "意外升职",     "获得意料之外的晋升机会",          10, 25, null, "🚀"),

        // 负向事件（可对冲）minBonus是最小值（更负），maxBonus是最大值（较不负面）
        new RandomEvent("illness",       "突发疾病",     "需要医疗支出和休养",              -15, -5, InvestmentType.HEALTH, "⚠️"),
        new RandomEvent("job_loss",      "失业",         "失去工作，收入中断",              -25, -10, InvestmentType.EDUCATION, "📉"),
        new RandomEvent("accident",      "意外受伤",     "需要医疗和康复",                  -10, -3, InvestmentType.HEALTH, "🤕"),
        new RandomEvent("bad_invest",    "投资亏损",     "个人投资失败",                    -20, -5, null, "💸"),
    };

    /**
     * 计算扩展里程碑加成
     */
    public static double calcExtendedBonus(UserProfile user, List<String> userSkills, Map<String, Integer> streaks) {
        double bonus = 0;

        // 技能型里程碑
        if (userSkills != null) {
            for (SkillMilestone sm : SKILL_MILESTONES) {
                if (userSkills.stream().anyMatch(s -> s.contains(sm.skill))) {
                    bonus += sm.bonus;
                }
            }
        }

        // 连续型里程碑
        if (streaks != null) {
            for (StreakMilestone stm : STREAK_MILESTONES) {
                Integer days = streaks.get(stm.activity);
                if (days != null && days >= stm.days) {
                    bonus += stm.bonus;
                }
            }
        }

        return bonus;
    }

    /**
     * 触发一个随机事件，计算实际影响（考虑对冲）
     */
    public static double triggerRandomEvent(RandomEvent event, UserProfile user, Random random) {
        int baseImpact = event.minBonus + random.nextInt(event.maxBonus - event.minBonus + 1);

        // 检查是否可以对冲
        if (event.hedgeType != null && baseImpact < 0) {
            double hedgeAmount = user.investments.stream()
                .filter(inv -> inv.type == event.hedgeType)
                .mapToDouble(inv -> inv.amount)
                .sum();

            // 如果对冲类型投入超过阈值，减少50%负面影响
            if (hedgeAmount >= 50000) {
                baseImpact = (int)(baseImpact * 0.5);
                System.out.printf("  🛡️  %s投入充足，%s影响减少50%%！%n", event.hedgeType.label, event.name);
            }
        }

        return baseImpact;
    }
}
