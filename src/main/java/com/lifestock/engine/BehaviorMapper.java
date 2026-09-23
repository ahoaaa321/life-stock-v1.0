package com.lifestock.engine;

import com.lifestock.model.UserProfile;
import com.lifestock.model.StockSnapshot;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 行为 → 股票参数 映射器
 *
 * 把人生的各种行为/状态映射为股票分析指标：
 * - 教育投入 → 账面价值 BV
 * - 年收入 → 每股收益 EPS
 * - 健康状况 → 资产质量
 * - 学习时长 → 研发投入占比
 * - 负债 → 资产负债率
 * - 情绪稳定 → 波动率 Beta
 * - 技能证书 → 无形资产
 * - 成就荣誉 → 品牌溢价
 */
public class BehaviorMapper {

    /**
     * 生成完整的"人生-股票"对照报告
     */
    public static Map<String, String> generateMappingReport(UserProfile user, StockSnapshot snapshot) {
        Map<String, String> report = new LinkedHashMap<>();

        report.put("【价值类】", "");
        report.put("  累计教育投入", String.format("¥%.0f → 账面价值 BV = %.1f",
            sumInvestment(user), snapshot.bookValue));
        report.put("  年收入", String.format("¥%.0f → 每股收益 EPS = %.1f",
            user.annualIncome, snapshot.eps));
        report.put("  年收入/累计投入", String.format("→ 净资产收益率 ROE = %.1f%%",
            snapshot.roe));

        report.put("【成长类】", "");
        report.put("  每日学习 " + user.dailyStudyMinutes + "分钟",
            String.format("→ 研发投入占比 = %.1f%%", snapshot.rdRatio * 100));
        report.put("  学习时长越高", "→ 成长系数越高 → 估值溢价越大");

        report.put("【质量类】", "");
        report.put("  健康评分 " + user.healthScore + "分",
            String.format("→ 资产质量系数 = %.2f (0.85~1.2)", 0.85 + (user.healthScore / 100.0) * 0.35));
        report.put("  技能证书 " + user.skillCount + "个",
            String.format("→ 无形资产 = %.0f", user.skillCount * 5.0));
        report.put("  职业: " + user.industry.label,
            String.format("→ 行业PE = %.0f倍", user.industry.pe));

        report.put("【风险类】", "");
        report.put("  总负债 ¥" + String.format("%.0f", user.totalDebt),
            String.format("→ 资产负债率 = %.1f%%", snapshot.assetLiabilityRatio * 100));
        report.put("  健康评分 → 情绪稳定性",
            String.format("→ 波动率 Beta = %.2f", snapshot.beta));

        report.put("【综合】", "");
        report.put("  人生阶段", snapshot.stage);
        report.put("  里程碑溢价", String.format("+%.0f点", snapshot.milestoneBonus));
        report.put("  随机波动", String.format("%.1f%%", snapshot.randomNoise * 100));
        report.put("  ★ 最终股价", String.format("¥%.1f", snapshot.price));

        return report;
    }

    private static double sumInvestment(UserProfile user) {
        return user.investments.stream()
            .mapToDouble(inv -> inv.amount)
            .sum();
    }
}
