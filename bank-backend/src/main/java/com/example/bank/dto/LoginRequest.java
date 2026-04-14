package com.example.bank.dto;

public class LoginRequest {
    private String email;
    private String password;

    public LoginRequest() {
        // Costruttore di default
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
