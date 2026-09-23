package com.lifestock.model;

import java.util.Map;
import java.util.LinkedHashMap;

/**
 * 个人股票快照（某一时刻的完整股票指标）
 */
public class StockSnapshot {
    public int age;
    public double price;              // 股价
    public double bookValue;          // 账面价值 BV
    public double eps;                // 每股收益 EPS（年收入）
    public double roe;                // 净资产收益率 ROE
    public double pe;                 // 市盈率 PE
    public double assetLiabilityRatio;// 资产负债率
    public double beta;               // 波动率 Beta
    public double rdRatio;            // 研发投入占比（学习时间占比）
    public String stage;              // 人生阶段
    public double milestoneBonus;     // 里程碑溢价
    public double randomNoise;        // 随机波动
    public Map<String, Double> indicators = new LinkedHashMap<>();  // 所有指标明细

    @Override
    public String toString() {
        return String.format(
            "=== 个人股票行情卡 ===%n" +
            "股价:    ¥%.1f  (%.0f%%)%n" +
            "BV:      ¥%.1f%n" +
            "EPS:     ¥%.1f%n" +
            "ROE:     %.1f%%%n" +
            "PE:      %.1f倍%n" +
            "负债率:  %.1f%%%n" +
            "Beta:    %.2f%n" +
            "研发占比: %.1f%%%n" +
            "阶段:    %s%n" +
            "======================",
            price, (price - 100) / 100 * 100,
            bookValue, eps, roe, pe,
            assetLiabilityRatio * 100, beta, rdRatio * 100, stage
        );
    }
}
