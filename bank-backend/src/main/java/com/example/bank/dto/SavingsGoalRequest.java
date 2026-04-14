package com.example.bank.dto;

import java.math.BigDecimal;

public class SavingsGoalRequest {
    private String name;
    private BigDecimal targetAmount;
    private BigDecimal amount; // Used for deposit/withdraw

    public SavingsGoalRequest() {
        // Costruttore di default
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
