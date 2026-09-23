package com.lifestock.engine;

import com.lifestock.constants.Constants;
import com.lifestock.constants.Constants.LifeStage;
import com.lifestock.model.UserProfile;
import com.lifestock.model.StockSnapshot;

import java.util.*;

/**
 * 股价预测引擎
 * 基于当前数据预测未来1-3年的股价走势
 *
 * 预测逻辑：
 * 1. 历史趋势分析：计算过去3年的股价增长率
 * 2. 行为惯性：根据当前学习/投入习惯预测未来投入
 * 3. 阶段转换：预测即将进入的人生阶段
 * 4. 蒙特卡洛模拟：生成多条可能路径，给出置信区间
 */
public class StockForecaster {

    private final StockCalculator calculator = new StockCalculator();
    private final Random random = new Random();

    /**
     * 预测结果
     */
    public static class Forecast {
        public int year;                // 预测年份（相对当前）
        public int age;                 // 预测时的年龄
        public double priceOptimistic;  // 乐观估计（75分位）
        public double priceExpected;    // 预期估计（50分位）
        public double pricePessimistic; // 悲观估计（25分位）
        public String stage;            // 预测时的人生阶段
        public List<String> keyEvents;  // 关键事件预测

        @Override
        public String toString() {
            return String.format("%d年后(%d岁): 预期¥%.0f [¥%.0f ~ ¥%.0f] %s",
                year, age, priceExpected, pricePessimistic, priceOptimistic, stage);
        }
    }

    /**
     * 预测未来N年的股价
     *
     * @param user 当前用户
     * @param years 预测年数（1-3）
     * @return 预测结果列表
     */
    public List<Forecast> forecast(UserProfile user, int years) {
        List<Forecast> forecasts = new ArrayList<>();

        // 计算历史增长率（用于趋势外推）
        double historicalGrowth = calcHistoricalGrowth(user);

        for (int y = 1; y <= years; y++) {
            Forecast f = new Forecast();
            f.year = y;
            f.age = user.currentAge + y;

            // 预测该年的人生阶段
            LifeStage futureStage = StockCalculator.getLifeStage(f.age);
            f.stage = futureStage.label;

            // 预测关键事件
            f.keyEvents = predictKeyEvents(user, f.age);

            // 蒙特卡洛模拟：生成100条路径，取分位数
            List<Double> simulations = new ArrayList<>();
            for (int i = 0; i < 100; i++) {
                double simPrice = simulateFuturePrice(user, y, historicalGrowth);
                simulations.add(simPrice);
            }

            Collections.sort(simulations);
            f.pricePessimistic = simulations.get(25);   // 25分位
            f.priceExpected = simulations.get(50);      // 50分位（中位数）
            f.priceOptimistic = simulations.get(75);    // 75分位

            forecasts.add(f);
        }

        return forecasts;
    }

    /**
     * 计算历史股价增长率（CAGR）
     * 如果有K线数据，用最近3年的复合年增长率
     */
    private double calcHistoricalGrowth(UserProfile user) {
        // 简化版：基于学习时长和当前阶段
        double rdRatio = Math.min(1.0, user.dailyStudyMinutes / 480.0);
        LifeStage stage = StockCalculator.getLifeStage(user.currentAge);

        // 基础增长率 = 研发占比 × 10% + 阶段系数加成
        double baseGrowth = rdRatio * 0.10 + (stage.coeff - 1.0) * 0.05;

        // 收入增长率（如果有）
        if (user.annualIncome > 0) {
            baseGrowth += 0.03;  // 有稳定收入+3%
        }

        return Math.max(0.02, Math.min(0.25, baseGrowth));  // 限制在2%-25%
    }

    /**
     * 模拟未来某年的股价（蒙特卡洛）
     */
    private double simulateFuturePrice(UserProfile user, int yearsAhead, double growthRate) {
        // 克隆用户，模拟未来状态
        UserProfile futureUser = cloneUser(user);
        futureUser.currentAge = user.currentAge + yearsAhead;

        // 模拟未来的投入（基于当前投入习惯）
        double avgAnnualInvestment = user.investments.stream()
            .mapToDouble(inv -> inv.amount)
            .average()
            .orElse(10000);

        // 添加未来的投入（带随机性）
        for (int y = 1; y <= yearsAhead; y++) {
            double randomFactor = 0.7 + random.nextDouble() * 0.6;  // 70%-130%
            double yearlyInvestment = avgAnnualInvestment * randomFactor;

            // 根据学习时长决定投入类型
            if (user.dailyStudyMinutes > 30) {
                // 学习型：70%教育 + 30%健康
                futureUser.addInvestment(new com.lifestock.model.Investment(
                    yearlyInvestment * 0.7,
                    com.lifestock.constants.Constants.InvestmentType.EDUCATION,
                    user.currentAge + y,
                    "预测：教育投入"
                ));
                futureUser.addInvestment(new com.lifestock.model.Investment(
                    yearlyInvestment * 0.3,
                    com.lifestock.constants.Constants.InvestmentType.HEALTH,
                    user.currentAge + y,
                    "预测：健康投入"
                ));
            } else {
                // 非学习型：50%娱乐 + 50%健康
                futureUser.addInvestment(new com.lifestock.model.Investment(
                    yearlyInvestment * 0.5,
                    com.lifestock.constants.Constants.InvestmentType.ENTERTAINMENT,
                    user.currentAge + y,
                    "预测：娱乐消费"
                ));
                futureUser.addInvestment(new com.lifestock.model.Investment(
                    yearlyInvestment * 0.5,
                    com.lifestock.constants.Constants.InvestmentType.HEALTH,
                    user.currentAge + y,
                    "预测：健康投入"
                ));
            }
        }

        // 模拟随机事件（每年20%概率）
        for (int y = 1; y <= yearsAhead; y++) {
            if (random.nextDouble() < 0.2) {
                ExtendedMilestones.RandomEvent[] events = ExtendedMilestones.RANDOM_EVENTS;
                ExtendedMilestones.RandomEvent event = events[random.nextInt(events.length)];
                double impact = ExtendedMilestones.triggerRandomEvent(event, futureUser, random);
                // 将事件影响转化为一次性投入/损失
                if (impact != 0) {
                    futureUser.addInvestment(new com.lifestock.model.Investment(
                        Math.abs(impact) * 1000,  // 影响点数转回金额
                        impact > 0 ? com.lifestock.constants.Constants.InvestmentType.SOCIAL
                                  : com.lifestock.constants.Constants.InvestmentType.OTHER,
                        user.currentAge + y,
                        "预测：" + event.name
                    ));
                }
            }
        }

        // 模拟收入增长（每年增长5-15%）
        futureUser.annualIncome = user.annualIncome * Math.pow(1.05 + random.nextDouble() * 0.1, yearsAhead);

        // 计算未来股价
        StockSnapshot snapshot = calculator.calculate(futureUser);
        return snapshot.price;
    }

    /**
     * 预测关键事件
     */
    private List<String> predictKeyEvents(UserProfile user, int futureAge) {
        List<String> events = new ArrayList<>();

        // 年龄相关事件
        if (futureAge == 30) events.add("🚀 三十而立");
        if (futureAge == 35) events.add("💼 职场成熟期");
        if (futureAge == 40) events.add("👨‍👩‍👧 子女教育投入期");

        // 阶段转换
        LifeStage currentStage = StockCalculator.getLifeStage(user.currentAge);
        LifeStage futureStage = StockCalculator.getLifeStage(futureAge);
        if (!currentStage.label.equals(futureStage.label)) {
            events.add("📊 进入「" + futureStage.label + "」阶段");
        }

        // 收入预测
        if (user.annualIncome > 0) {
            double futureIncome = user.annualIncome * Math.pow(1.08, futureAge - user.currentAge);
            if (futureIncome > user.annualIncome * 1.3) {
                events.add("💰 收入预计增长30%+");
            }
        }

        return events;
    }

    /**
     * 克隆用户（用于模拟未来状态）
     */
    private UserProfile cloneUser(UserProfile original) {
        UserProfile clone = new UserProfile(original.currentAge, original.region, original.incomeQuintile);
        clone.industry = original.industry;
        clone.annualIncome = original.annualIncome;
        clone.totalDebt = original.totalDebt;
        clone.healthScore = original.healthScore;
        clone.skillCount = original.skillCount;
        clone.dailyStudyMinutes = original.dailyStudyMinutes;
        clone.investments = new ArrayList<>(original.investments);
        clone.achievements = new ArrayList<>(original.achievements);
        return clone;
    }

    /**
     * 生成预测报告
     */
    public String generateForecastReport(UserProfile user, int years) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n╔══════════════════════════════════════════════╗\n");
        sb.append("║           未来 ").append(years).append(" 年股价预测报告                ║\n");
        sb.append("╚══════════════════════════════════════════════╝\n");

        StockCalculator calc = new StockCalculator();
        StockSnapshot current = calc.calculate(user);
        sb.append(String.format("\n当前股价: ¥%.1f (%d岁, %s)\n",
            current.price, user.currentAge, current.stage));

        List<Forecast> forecasts = forecast(user, years);
        for (Forecast f : forecasts) {
            sb.append("\n").append(f.toString()).append("\n");
            if (!f.keyEvents.isEmpty()) {
                sb.append("  关键事件:\n");
                for (String event : f.keyEvents) {
                    sb.append("    • ").append(event).append("\n");
                }
            }

            // 计算涨跌幅
            double changeRate = (f.priceExpected - current.price) / current.price * 100;
            sb.append(String.format("  预期涨幅: %+.1f%%\n", changeRate));
        }

        return sb.toString();
    }
}
