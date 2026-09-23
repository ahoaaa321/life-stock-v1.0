package com.lifestock.engine;

import com.lifestock.constants.Constants;
import com.lifestock.constants.Constants.InvestmentType;
import com.lifestock.constants.Constants.LifeStage;
import com.lifestock.model.Investment;
import com.lifestock.model.StockSnapshot;
import com.lifestock.model.UserProfile;

import java.util.Random;

/**
 * 股价计算引擎
 *
 * 核心公式：
 * P(t) = P₀ + Σᵢ[(Aᵢ/K) × Wᵢ × Fᵢ(t)] × C(t) + M(t) + ε(t)
 *
 * 其中：
 * - P₀ = IPO发行价(100)
 * - Aᵢ = 第i笔投入金额
 * - K = 归一化系数(1000)
 * - Wᵢ = 投入类型权重
 * - Fᵢ(t) = 时间衰减函数 exp(-0.693 × Δt / halfLife)
 * - C(t) = 人生阶段系数
 * - M(t) = 里程碑溢价
 * - ε(t) = 随机波动 ±5%
 */
public class StockCalculator {

    private final Random random = new Random();

    /**
     * 计算当前股价快照
     */
    public StockSnapshot calculate(UserProfile user) {
        StockSnapshot snapshot = new StockSnapshot();
        snapshot.age = user.currentAge;

        // 1. 计算累计投入贡献（BV基础）
        double investmentContribution = calcInvestmentContribution(user);

        // 2. 获取人生阶段系数
        LifeStage stage = getLifeStage(user.currentAge);
        snapshot.stage = stage.label;
        double stageCoeff = stage.coeff;

        // 3. 计算账面价值 BV = Σ(投入×权重×衰减) / K
        double bookValue = calcBookValue(user);
        snapshot.bookValue = bookValue;

        // 4. 里程碑溢价
        double milestoneBonus = MilestoneEngine.calcMilestoneBonus(user);
        snapshot.milestoneBonus = milestoneBonus;

        // 5. 随机波动
        double randomNoise = (random.nextDouble() - 0.5) * 2 * Constants.RANDOM_VOLATILITY;
        snapshot.randomNoise = randomNoise;

        // 6. 计算基础股价
        double basePrice = Constants.IPO_PRICE
                + investmentContribution * stageCoeff
                + milestoneBonus;

        // 7. 计算EPS（每股收益 = 年收入，单位：万）
        snapshot.eps = user.annualIncome / 10000.0;

        // 8. 计算ROE = EPS / BV
        snapshot.roe = bookValue > 0 ? (snapshot.eps / bookValue) * 100 : 0;

        // 9. 行业PE
        double industryPE = user.industry.pe;

        // 10. 成长系数（基于学习时长+收入增速，简化版）
        double growthCoeff = calcGrowthCoefficient(user);

        // 11. 质量系数（基于健康+技能）
        double qualityCoeff = calcQualityCoefficient(user);

        // 12. 风险折价（基于负债率+波动率）
        double riskDiscount = calcRiskDiscount(user);

        // 13. 综合股价
        // 核心公式：股价 = (IPO价 + BV×阶段系数 + 里程碑溢价 + 无形资产) × 成长系数 × 质量系数 × (1-风险折价) × (1+随机波动)
        // 注意：BV已是归一化后的点数，不再乘PE；PE由 股价/EPS 反算得出
        double intangibleAssets = user.skillCount * 3;  // 无形资产（技能证书，每个+3点）
        double baseValue = Constants.IPO_PRICE
                + bookValue * stageCoeff
                + milestoneBonus
                + intangibleAssets;
        snapshot.price = baseValue
                * growthCoeff
                * qualityCoeff
                * (1 - riskDiscount)
                * (1 + randomNoise);

        // 保证股价不低于发行价的一半
        snapshot.price = Math.max(snapshot.price, Constants.IPO_PRICE * 0.5);

        // 14. PE = 股价 / EPS
        snapshot.pe = snapshot.eps > 0 ? snapshot.price / snapshot.eps : 999;

        // 15. 资产负债率
        double totalAssets = bookValue * Constants.NORMALIZE_K;
        snapshot.assetLiabilityRatio = totalAssets > 0 ? user.totalDebt / totalAssets : 0;

        // 16. Beta波动率（基于情绪稳定性，简化为健康相关）
        snapshot.beta = 2.0 - (user.healthScore / 100.0) * 1.5;  // 0.5 ~ 2.0
        snapshot.beta = Math.max(0.5, Math.min(2.0, snapshot.beta));

        // 17. 研发投入占比（学习时间占可支配时间）
        // 假设每天可支配时间480分钟（8小时）
        snapshot.rdRatio = Math.min(1.0, user.dailyStudyMinutes / 480.0);

        // 填充指标明细
        snapshot.indicators.put("股价", snapshot.price);
        snapshot.indicators.put("BV账面价值", bookValue);
        snapshot.indicators.put("EPS每股收益", snapshot.eps);
        snapshot.indicators.put("ROE净资产收益率", snapshot.roe);
        snapshot.indicators.put("PE市盈率", snapshot.pe);
        snapshot.indicators.put("资产负债率", snapshot.assetLiabilityRatio * 100);
        snapshot.indicators.put("Beta波动率", snapshot.beta);
        snapshot.indicators.put("研发投入占比", snapshot.rdRatio * 100);
        snapshot.indicators.put("里程碑溢价", milestoneBonus);

        return snapshot;
    }

    /**
     * 计算所有投入对当前的贡献值（未乘阶段系数）
     */
    private double calcInvestmentContribution(UserProfile user) {
        double total = 0;
        for (Investment inv : user.investments) {
            double points = inv.amount / Constants.NORMALIZE_K;
            double weight = inv.type.weight;
            int yearsAgo = user.currentAge - inv.age;
            double decay = calcDecay(yearsAgo, inv.type.halfLife);
            total += points * weight * decay;
        }
        return total;
    }

    /**
     * 计算账面价值 BV = Σ(投入×权重×衰减) / K
     */
    public double calcBookValue(UserProfile user) {
        return calcInvestmentContribution(user);
    }

    /**
     * 时间衰减函数：F(t) = exp(-0.693 × Δt / halfLife)
     * 0.693 = ln2，即经过一个半衰期，价值衰减为原来的50%
     */
    public static double calcDecay(int yearsAgo, int halfLife) {
        if (yearsAgo <= 0) return 1.0;
        return Math.exp(-0.693 * yearsAgo / halfLife);
    }

    /**
     * 获取年龄对应的人生阶段
     */
    public static LifeStage getLifeStage(int age) {
        for (LifeStage stage : Constants.LIFE_STAGES) {
            if (age >= stage.minAge && age < stage.maxAge) {
                return stage;
            }
        }
        return Constants.LIFE_STAGES[Constants.LIFE_STAGES.length - 1];
    }

    /**
     * 成长系数：基于学习时长占比
     * 范围 0.8 ~ 1.5
     */
    private double calcGrowthCoefficient(UserProfile user) {
        double rdRatio = Math.min(1.0, user.dailyStudyMinutes / 480.0);
        // 研发占比0% → 0.8，100% → 1.5
        return 0.8 + rdRatio * 0.7;
    }

    /**
     * 质量系数：基于健康评分
     * 范围 0.85 ~ 1.2
     */
    private double calcQualityCoefficient(UserProfile user) {
        // 健康0分 → 0.85，100分 → 1.2
        return 0.85 + (user.healthScore / 100.0) * 0.35;
    }

    /**
     * 风险折价：基于资产负债率
     * 范围 0 ~ 0.3
     */
    private double calcRiskDiscount(UserProfile user) {
        double totalAssets = calcBookValue(user) * Constants.NORMALIZE_K;
        if (totalAssets <= 0) return 0;
        double ratio = user.totalDebt / totalAssets;
        // 负债率0% → 0折价，100% → 30%折价
        return Math.min(0.3, ratio * 0.3);
    }
}
