package com.lifestock.model;

import com.lifestock.constants.Constants.IncomeQuintile;
import com.lifestock.constants.Constants.Region;
import com.lifestock.constants.Constants.Industry;

import java.util.ArrayList;
import java.util.List;

/**
 * 用户画像（3个核心问题 + 扩展信息）
 */
public class UserProfile {
    public int currentAge;                         // 当前年龄
    public Region region;                          // 地区
    public IncomeQuintile incomeQuintile;          // 收入分位数（消费水平自评）
    public Industry industry;                      // 职业/行业
    public double annualIncome;                    // 年收入（元）
    public double totalDebt;                       // 总负债（元）
    public int healthScore;                        // 健康评分 0-100
    public int skillCount;                         // 技能证书数
    public int dailyStudyMinutes;                  // 每日学习时长（分钟）
    public List<Investment> investments = new ArrayList<>();  // 所有投入记录
    public List<String> achievements = new ArrayList<>();     // 已达成的成就

    public UserProfile(int currentAge, Region region, IncomeQuintile incomeQuintile) {
        this.currentAge = currentAge;
        this.region = region;
        this.incomeQuintile = incomeQuintile;
        this.industry = Industry.OTHER;
        this.annualIncome = 0;
        this.totalDebt = 0;
        this.healthScore = 70;
        this.skillCount = 0;
        this.dailyStudyMinutes = 0;
    }

    /** 添加一笔投资 */
    public void addInvestment(Investment inv) {
        investments.add(inv);
    }

    /** 添加一个成就 */
    public void addAchievement(String achievement) {
        achievements.add(achievement);
    }
}
