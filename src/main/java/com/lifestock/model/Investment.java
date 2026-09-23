package com.lifestock.model;

import com.lifestock.constants.Constants.InvestmentType;

/**
 * 一笔对自己的投资（股东注资）
 */
public class Investment {
    public double amount;              // 投入金额（元）
    public InvestmentType type;        // 投入类型
    public int age;                    // 投入时的年龄
    public String description;         // 描述（可选）
    public long timestamp;             // 时间戳

    public Investment(double amount, InvestmentType type, int age, String description) {
        this.amount = amount;
        this.type = type;
        this.age = age;
        this.description = description;
        this.timestamp = System.currentTimeMillis();
    }

    @Override
    public String toString() {
        return String.format("[%d岁] %s ¥%.0f (%s)", age, type.icon, amount, type.label);
    }
}
