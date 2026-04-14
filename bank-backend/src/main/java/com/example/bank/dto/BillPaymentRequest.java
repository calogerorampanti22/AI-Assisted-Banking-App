package com.example.bank.dto;

import java.math.BigDecimal;

import com.example.bank.model.TransactionCategory;

public class BillPaymentRequest {
    private BigDecimal amount;
    private String billerName;
    private String billReferenceNumber;
    private String description;
    private TransactionCategory category;

    public BillPaymentRequest() {
        // Costruttore di default
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getBillerName() {
        return billerName;
    }

    public void setBillerName(String billerName) {
        this.billerName = billerName;
    }

    public String getBillReferenceNumber() {
        return billReferenceNumber;
    }

    public void setBillReferenceNumber(String billReferenceNumber) {
        this.billReferenceNumber = billReferenceNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TransactionCategory getCategory() {
        return category;
    }

    public void setType(TransactionCategory category) {
        this.category = category;
    }
}
