package com.example.bank.dto;

public class BeneficiaryRequest {
    private String firstName;
    private String lastName;
    private String iban;

    public BeneficiaryRequest() {
        // Costruttore di default
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }
}
