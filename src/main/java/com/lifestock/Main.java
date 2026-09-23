package com.lifestock;

import com.lifestock.constants.Constants.IncomeQuintile;
import com.lifestock.constants.Constants.Region;
import com.lifestock.constants.Constants.Industry;
import com.lifestock.constants.Constants.InvestmentType;
import com.lifestock.engine.DataFiller;
import com.lifestock.engine.DataFiller.MemoryAnchor;
import com.lifestock.engine.StockCalculator;
import com.lifestock.engine.MilestoneEngine;
import com.lifestock.engine.BehaviorMapper;
import com.lifestock.model.UserProfile;
import com.lifestock.model.StockSnapshot;

import java.util.*;

/**
 * 测试入口：26岁程序员小明的完整计算演示
 *
 * 场景：
 * - 杭州（新一线），家庭条件高于同龄人
 * - 26岁，互联网程序员，年收入25万
 * - 累计教育投入约40万（系统估算+锚点修正）
 * - 健康评分80，有3个技能证书，每天学习1小时
 * - 无负债
 *
 * 预期：股价应该在400-600之间，是一只高成长科技股
 */
public class Main {

    public static void main(String[] args) {
        System.out.println("╔══════════════════════════════════════════════╗");
        System.out.println("║       人生即股票 - 核心算法测试              ║");
        System.out.println("╚══════════════════════════════════════════════╝\n");

        // ===== 模拟用户回答的3个核心问题 =====
        System.out.println("【Step 1】用户画像（3个问题）");
        System.out.println("  Q1: 你的地区？ → 杭州（新一线）");
        System.out.println("  Q2: 家庭消费水平？ → 高于同龄人");
        System.out.println("  Q3: 你的职业？ → 互联网/科技");

        UserProfile user = new UserProfile(26, Region.NEW_TIER_1, IncomeQuintile.ABOVE);
        user.industry = Industry.INTERNET;
        user.annualIncome = 250000;      // 年收入25万
        user.totalDebt = 0;              // 无负债
        user.healthScore = 80;           // 健康评分80
        user.skillCount = 3;             // 3个技能证书
        user.dailyStudyMinutes = 60;     // 每天学习1小时

        // ===== 模拟用户回忆的记忆锚点 =====
        System.out.println("\n【Step 2】记忆锚点（用户回忆的大额支出）");
        List<MemoryAnchor> anchors = new ArrayList<>();
        anchors.add(new MemoryAnchor(16, 50000, InvestmentType.EDUCATION));  // 高中补课5万
        anchors.add(new MemoryAnchor(18, 120000, InvestmentType.EDUCATION)); // 大学4年12万
        anchors.add(new MemoryAnchor(24, 8000, InvestmentType.SKILL));       // 编程培训8千
        for (MemoryAnchor a : anchors) {
            System.out.printf("  %d岁: ¥%.0f %s%n", a.age, a.amount, a.type.label);
        }

        // ===== 精度填充：生成历史投入曲线 =====
        System.out.println("\n【Step 3】精度填充（3问 + 锚点 → 历史投入曲线）");
        DataFiller filler = new DataFiller();
        user = filler.fillHistoricalData(user, anchors);

        System.out.printf("  系统生成投入记录: %d 笔%n", user.investments.size());
        double totalInvested = user.investments.stream()
            .mapToDouble(inv -> inv.amount).sum();
        System.out.printf("  累计投入总额: ¥%.0f (约 %.1f万)%n", totalInvested, totalInvested / 10000);

        // 展示每年的投入汇总
        System.out.println("\n  各年龄段投入汇总:");
        Map<Integer, Double> byAge = new TreeMap<>();
        for (var inv : user.investments) {
            byAge.merge(inv.age, inv.amount, Double::sum);
        }
        for (var entry : byAge.entrySet()) {
            if (entry.getKey() <= 18 || entry.getKey() >= 24) {
                System.out.printf("    %d岁: ¥%.0f%n", entry.getKey(), entry.getValue());
            }
        }

        // ===== 计算当前股价 =====
        System.out.println("\n【Step 4】计算当前股价");
        StockCalculator calculator = new StockCalculator();
        StockSnapshot snapshot = calculator.calculate(user);

        System.out.println(snapshot);

        // ===== 里程碑 =====
        System.out.println("\n【Step 5】已达成的里程碑");
        List<String> milestones = MilestoneEngine.getTriggeredMilestones(user);
        for (String m : milestones) {
            System.out.println("  ✓ " + m);
        }

        System.out.println("\n  未达成的里程碑:");
        List<String> pending = MilestoneEngine.getPendingMilestones(user);
        for (String p : pending) {
            System.out.println("  ⏳ " + p);
        }

        // ===== 行为→股票参数映射 =====
        System.out.println("\n【Step 6】人生行为 → 股票参数 映射");
        Map<String, String> report = BehaviorMapper.generateMappingReport(user, snapshot);
        for (var entry : report.entrySet()) {
            if (entry.getValue().isEmpty()) {
                System.out.println(entry.getKey());
            } else {
                System.out.println("  " + entry.getKey() + "  →  " + entry.getValue());
            }
        }

        // ===== K线数据 =====
        System.out.println("\n【Step 7】人生K线数据（关键节点）");
        Map<Integer, Double> kline = filler.generateKLineData(user);
        int[] keyAges = {0, 6, 12, 15, 18, 22, 25, 26};
        for (int age : keyAges) {
            if (kline.containsKey(age)) {
                String bar = "█".repeat((int) Math.min(kline.get(age) / 20, 30));
                System.out.printf("  %d岁: ¥%7.1f  %s%n", age, kline.get(age), bar);
            }
        }

        System.out.println("\n╔══════════════════════════════════════════════╗");
        System.out.println("║  核心算法测试完成                             ║");
        System.out.println("╚══════════════════════════════════════════════╝");

        // ========== 新增功能测试 ==========
        System.out.println("\n\n");
        System.out.println("╔══════════════════════════════════════════════╗");
        System.out.println("║       扩展功能测试                            ║");
        System.out.println("╚══════════════════════════════════════════════╝\n");

        // ===== 扩展里程碑（技能型+连续型） =====
        System.out.println("【Step 8】扩展里程碑（技能型+连续型）");
        List<String> skills = Arrays.asList("Java", "PMP", "英语");
        Map<String, Integer> streaks = new HashMap<>();
        streaks.put("阅读", 120);  // 坚持阅读120天
        streaks.put("学习", 45);   // 坚持学习45天

        double extendedBonus = com.lifestock.engine.ExtendedMilestones.calcExtendedBonus(user, skills, streaks);
        System.out.printf("  用户技能: %s%n", skills);
        System.out.printf("  连续打卡: %s%n", streaks);
        System.out.printf("  扩展里程碑加成: +%.0f点%n", extendedBonus);

        // ===== 股价预测 =====
        System.out.println("\n【Step 9】未来3年股价预测");
        com.lifestock.engine.StockForecaster forecaster = new com.lifestock.engine.StockForecaster();
        String forecastReport = forecaster.generateForecastReport(user, 3);
        System.out.println(forecastReport);

        // ===== 个人财报 =====
        System.out.println("\n【Step 10】2025年度个人财报");
        com.lifestock.engine.FinancialReport financialReport = new com.lifestock.engine.FinancialReport();
        com.lifestock.engine.FinancialReport.AnnualReport annualReport =
            financialReport.generateAnnualReport(user, 2025);
        System.out.println(annualReport);

        // ===== 分享卡片 =====
        System.out.println("\n【Step 11】可分享的行情卡片");
        String shareCard = financialReport.generateShareCard(user);
        System.out.println(shareCard);

        System.out.println("\n╔══════════════════════════════════════════════╗");
        System.out.println("║  全部测试完成！算法已就绪可集成到产品         ║");
        System.out.println("╚══════════════════════════════════════════════╝");
    }
}
