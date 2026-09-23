package com.lifestock.engine;

import com.lifestock.constants.Constants;
import com.lifestock.constants.Constants.InvestmentType;
import com.lifestock.model.Investment;
import com.lifestock.model.UserProfile;

import java.util.*;

/**
 * 里程碑引擎
 * 负责检测和触发各类里程碑，并计算里程碑溢价
 */
public class MilestoneEngine {

    /**
     * 计算用户的里程碑溢价总额
     */
    public static double calcMilestoneBonus(UserProfile user) {
        double bonus = 0;
        List<String> triggered = new ArrayList<>();

        // 1. 投入型里程碑
        double totalEdu = sumByType(user, InvestmentType.EDUCATION);
        double totalHealth = sumByType(user, InvestmentType.HEALTH);
        double totalSkill = sumByType(user, InvestmentType.SKILL);

        if (totalEdu >= 0) {
            bonus += 5; triggered.add("第一笔教育投入 🌱");
        }
        if (totalEdu >= 10000) {
            bonus += 10; triggered.add("万元学子 📚");
        }
        if (totalEdu >= 100000) {
            bonus += 30; triggered.add("十万学子 🎓");
        }
        if (totalHealth >= 5000) {
            bonus += 8; triggered.add("健康达人 💪");
        }

        // 2. 时间型里程碑
        if (user.currentAge >= 6) {
            bonus += 10; triggered.add("小学入学 🎒");
        }
        if (user.currentAge >= 18) {
            bonus += 20; triggered.add("高考 📝");
            bonus += 15; triggered.add("成年 🎉");
        }
        if (user.currentAge >= 30) {
            bonus += 25; triggered.add("三十而立 🚀");
        }

        // 3. 成就型里程碑（用户手动确认的）
        for (String achievement : user.achievements) {
            if (achievement.contains("第一份工作")) bonus += 30;
            if (achievement.contains("涨薪")) bonus += 15;
            if (achievement.contains("驾照")) bonus += 5;
            if (achievement.contains("马拉松")) bonus += 8;
        }

        return bonus;
    }

    /**
     * 获取已触发的里程碑列表（用于展示）
     */
    public static List<String> getTriggeredMilestones(UserProfile user) {
        List<String> milestones = new ArrayList<>();

        double totalEdu = sumByType(user, InvestmentType.EDUCATION);
        double totalHealth = sumByType(user, InvestmentType.HEALTH);

        if (totalEdu >= 0) milestones.add("🌱 第一笔教育投入 +5");
        if (totalEdu >= 10000) milestones.add("📚 万元学子 +10");
        if (totalEdu >= 100000) milestones.add("🎓 十万学子 +30");
        if (totalHealth >= 5000) milestones.add("💪 健康达人 +8");
        if (user.currentAge >= 6) milestones.add("🎒 小学入学 +10");
        if (user.currentAge >= 18) milestones.add("📝 高考 +20");
        if (user.currentAge >= 18) milestones.add("🎉 成年 +15");
        if (user.currentAge >= 30) milestones.add("🚀 三十而立 +25");

        for (String achievement : user.achievements) {
            milestones.add("🏆 " + achievement);
        }

        return milestones;
    }

    /**
     * 获取未达成的里程碑（进度展示）
     */
    public static List<String> getPendingMilestones(UserProfile user) {
        List<String> pending = new ArrayList<>();
        double totalEdu = sumByType(user, InvestmentType.EDUCATION);

        if (totalEdu < 10000) {
            pending.add(String.format("📚 万元学子 (还差 ¥%.0f)", 10000 - totalEdu));
        }
        if (totalEdu < 100000) {
            pending.add(String.format("🎓 十万学子 (还差 ¥%.0f)", 100000 - totalEdu));
        }
        if (user.currentAge < 30) {
            pending.add(String.format("🚀 三十而立 (还有 %d 年)", 30 - user.currentAge));
        }

        return pending;
    }

    /**
     * 按类型汇总投入金额
     */
    private static double sumByType(UserProfile user, InvestmentType type) {
        return user.investments.stream()
            .filter(inv -> inv.type == type)
            .mapToDouble(inv -> inv.amount)
            .sum();
    }
}
