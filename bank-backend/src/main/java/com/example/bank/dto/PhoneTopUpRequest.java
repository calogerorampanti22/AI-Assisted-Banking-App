package com.example.bank.dto;

import java.math.BigDecimal;

public class PhoneTopUpRequest {
    private String phoneNumber;
    private String operator;
    private BigDecimal amount;
    private boolean saveContact;
    private String contactName;

    public PhoneTopUpRequest() {
        // Costruttore di default
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public boolean isSaveContact() {
        return saveContact;
    }

    public void setSaveContact(boolean saveContact) {
        this.saveContact = saveContact;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }
}
