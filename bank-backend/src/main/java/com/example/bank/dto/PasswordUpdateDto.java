package com.example.bank.dto;

public class PasswordUpdateDto {

    private String oldPassword;
    private String newPassword;

    public PasswordUpdateDto() {
        // Costruttore di default
    }

    public PasswordUpdateDto(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
