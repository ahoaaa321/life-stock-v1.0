package com.lifestock.engine;

import com.lifestock.constants.Constants.InvestmentType;
import com.lifestock.model.Investment;
import com.lifestock.model.UserProfile;
import com.lifestock.model.StockSnapshot;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 个人财报生成器
 * 生成类似上市公司财报的个人成长报告
 */
public class FinancialReport {

    /**
     * 年度财报
     */
    public static class AnnualReport {
        public int year;                              // 年份（相对年龄）
        public double revenue;                        // 营收（年收入）
        public double totalInvestment;                // 总投入
        public Map<InvestmentType, Double> investmentBreakdown;  // 投入分类
        public double netWorth;                       // 净值（BV - 负债）
        public double roi;                            // 投资回报率
        public double stockPrice;                     // 年末股价
        public double yearChange;                     // 年度涨跌幅
        public List<String> milestones;               // 本年达成的里程碑
        public List<String> highlights;               // 亮点
        public List<String> risks;                    // 风险提示

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append("\n┌─────────────────────────────────────────┐\n");
            sb.append(String.format("│  %d 年度个人财报                        │\n", year));
            sb.append("├─────────────────────────────────────────┤\n");
            sb.append(String.format("│  💰 营收(EPS):        ¥%.1f万           │\n", revenue / 10000));
            sb.append(String.format("│  📊 总投入:           ¥%.1f万           │\n", totalInvestment / 10000));
            sb.append(String.format("│  📈 净值:             ¥%.1f             │\n", netWorth));
            sb.append(String.format("│  📉 ROI:              %.1f%%            │\n", roi));
            sb.append(String.format("│  💹 年末股价:         ¥%.1f             │\n", stockPrice));
            sb.append(String.format("│  📊 年度涨幅:         %+.1f%%           │\n", yearChange));
            sb.append("├─────────────────────────────────────────┤\n");

            if (!investmentBreakdown.isEmpty()) {
                sb.append("│  投入分类:                              │\n");
                for (var entry : investmentBreakdown.entrySet()) {
                    sb.append(String.format("│    %s %s: ¥%.0f (%.1f%%)%s│\n",
                        entry.getKey().icon, entry.getKey().label,
                        entry.getValue(),
                        entry.getValue() / totalInvestment * 100,
                        " ".repeat(Math.max(0, 20 - entry.getKey().label.length() * 2))));
                }
            }

            if (!milestones.isEmpty()) {
                sb.append("├─────────────────────────────────────────┤\n");
                sb.append("│  🏆 本年里程碑:                         │\n");
                for (String m : milestones) {
                    sb.append("│    ").append(m).append("\n");
                }
            }

            if (!highlights.isEmpty()) {
                sb.append("├─────────────────────────────────────────┤\n");
                sb.append("│  ✨ 亮点:                               │\n");
                for (String h : highlights) {
                    sb.append("│    ").append(h).append("\n");
                }
            }

            if (!risks.isEmpty()) {
                sb.append("├─────────────────────────────────────────┤\n");
                sb.append("│  ⚠️  风险提示:                           │\n");
                for (String r : risks) {
                    sb.append("│    ").append(r).append("\n");
                }
            }

            sb.append("└─────────────────────────────────────────┘");
            return sb.toString();
        }
    }

    /**
     * 生成本年度财报
     */
    public AnnualReport generateAnnualReport(UserProfile user, int year) {
        AnnualReport report = new AnnualReport();
        report.year = year;

        int targetAge = user.currentAge - (getCurrentYear() - year);

        // 1. 营收（年收入）
        report.revenue = user.annualIncome;

        // 2. 本年投入
        List<Investment> yearInvestments = user.investments.stream()
            .filter(inv -> inv.age == targetAge)
            .collect(Collectors.toList());
        report.totalInvestment = yearInvestments.stream()
            .mapToDouble(inv -> inv.amount)
            .sum();

        // 3. 投入分类
        report.investmentBreakdown = yearInvestments.stream()
            .collect(Collectors.groupingBy(
                inv -> inv.type,
                Collectors.summingDouble(inv -> inv.amount)
            ));

        // 4. 净值 = BV - 负债
        StockCalculator calc = new StockCalculator();
        double bv = calc.calcBookValue(user);
        report.netWorth = bv - user.totalDebt / 10000.0;

        // 5. ROI = (年收入 - 年投入) / 累计投入 × 100
        double totalInvested = user.investments.stream()
            .mapToDouble(inv -> inv.amount)
            .sum();
        report.roi = totalInvested > 0
            ? (report.revenue - report.totalInvestment) / totalInvested * 100
            : 0;

        // 6. 年末股价
        UserProfile tempUser = cloneUser(user);
        tempUser.currentAge = targetAge;
        StockSnapshot snapshot = calc.calculate(tempUser);
        report.stockPrice = snapshot.price;

        // 7. 年度涨跌幅（需要上一年数据，简化处理）
        report.yearChange = 5.0;  // 占位，实际需要上一年股价

        // 8. 本年里程碑
        report.milestones = MilestoneEngine.getTriggeredMilestones(user).stream()
            .filter(m -> m.contains(String.valueOf(targetAge)))
            .collect(Collectors.toList());

        // 9. 亮点
        report.highlights = generateHighlights(user, report);

        // 10. 风险提示
        report.risks = generateRisks(user, report);

        return report;
    }

    /**
     * 生成亮点
     */
    private List<String> generateHighlights(UserProfile user, AnnualReport report) {
        List<String> highlights = new ArrayList<>();

        if (report.roi > 50) {
            highlights.add(String.format("ROI高达 %.1f%%，投资回报优秀", report.roi));
        }
        if (user.dailyStudyMinutes >= 60) {
            highlights.add("每日学习超1小时，成长动力强劲");
        }
        if (user.healthScore >= 80) {
            highlights.add("健康状况优秀，资产质量高");
        }
        if (user.skillCount >= 3) {
            highlights.add(String.format("持有%d项技能认证，护城河深厚", user.skillCount));
        }
        if (report.yearChange > 20) {
            highlights.add(String.format("年度涨幅 %.1f%%，表现超预期", report.yearChange));
        }

        return highlights;
    }

    /**
     * 生成风险提示
     */
    private List<String> generateRisks(UserProfile user, AnnualReport report) {
        List<String> risks = new ArrayList<>();

        if (user.totalDebt > 0) {
            double debtRatio = user.totalDebt / (report.revenue * 5);  // 假设5年收入
            if (debtRatio > 0.5) {
                risks.add(String.format("负债率 %.1f%% 偏高，注意现金流", debtRatio * 100));
            }
        }
        if (user.dailyStudyMinutes < 30) {
            risks.add("学习投入不足，可能影响长期成长");
        }
        if (user.healthScore < 60) {
            risks.add("健康状况需关注，建议增加健康投入");
        }
        if (report.roi < 0) {
            risks.add("ROI为负，投入产出比需要优化");
        }

        return risks;
    }

    /**
     * 生成季度简报（简化版）
     */
    public String generateQuarterlySummary(UserProfile user, int quarter) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n📊 Q").append(quarter).append(" 季度简报\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━\n");

        StockCalculator calc = new StockCalculator();
        StockSnapshot snapshot = calc.calculate(user);

        sb.append(String.format("当前股价: ¥%.1f (%.1f%%)\n",
            snapshot.price, (snapshot.price - 100)));
        sb.append(String.format("本季投入: ¥%.0f\n",
            user.investments.stream().mapToDouble(inv -> inv.amount).sum() / 4));  // 简化

        sb.append(String.format("健康评分: %d/100\n", user.healthScore));
        sb.append(String.format("学习时长: %d分钟/天\n", user.dailyStudyMinutes));

        return sb.toString();
    }

    /**
     * 生成可分享的文本卡片
     */
    public String generateShareCard(UserProfile user) {
        StockCalculator calc = new StockCalculator();
        StockSnapshot snapshot = calc.calculate(user);

        return String.format(
            "╔═══════════════════════════════╗\n" +
            "║     我的人生股票行情卡         ║\n" +
            "╠═══════════════════════════════╣\n" +
            "║  代码: LIFE-%04d              ║\n" +
            "║  板块: %s                     ║\n" +
            "║  阶段: %s                     ║\n" +
            "╠═══════════════════════════════╣\n" +
            "║  股价: ¥%.1f  %+.1f%%         ║\n" +
            "║  BV:   %.1f                   ║\n" +
            "║  EPS:  %.1f                   ║\n" +
            "║  ROE:  %.1f%%                 ║\n" +
            "║  PE:   %.1f倍                 ║\n" +
            "╠═══════════════════════════════╣\n" +
            "║  累计投入: ¥%.1f万            ║\n" +
            "║  里程碑:   %d个已达成          ║\n" +
            "╚═══════════════════════════════╝\n",
            user.currentAge,
            user.industry.label,
            snapshot.stage,
            snapshot.price, (snapshot.price - 100),
            snapshot.bookValue,
            snapshot.eps,
            snapshot.roe,
            snapshot.pe,
            user.investments.stream().mapToDouble(inv -> inv.amount).sum() / 10000,
            MilestoneEngine.getTriggeredMilestones(user).size()
        );
    }

    private int getCurrentYear() {
        return Calendar.getInstance().get(Calendar.YEAR);
    }

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
}
