package com.example.bank.dto;

import java.math.BigDecimal;

public class TransferRequest {
    private BigDecimal amount;
    private String type; // IN o OUT
    private String relatedAccountNumber;
    private String description;
    private String recipientFirstName;
    private String recipientLastName;

    public TransferRequest() {
        // Costruttore di default
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRelatedAccountNumber() {
        return relatedAccountNumber;
    }

    public void setRelatedAccountNumber(String relatedAccountNumber) {
        this.relatedAccountNumber = relatedAccountNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRecipientFirstName() {
        return recipientFirstName;
    }

    public void setRecipientFirstName(String recipientFirstName) {
        this.recipientFirstName = recipientFirstName;
    }

    public String getRecipientLastName() {
        return recipientLastName;
    }

    public void setRecipientLastName(String recipientLastName) {
        this.recipientLastName = recipientLastName;
    }
}
