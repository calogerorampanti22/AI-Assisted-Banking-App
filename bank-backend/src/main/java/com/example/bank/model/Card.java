package com.example.bank.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @JsonIgnore
    private Account account;

    @Enumerated(EnumType.STRING)
    private CardType type;

    @Enumerated(EnumType.STRING)
    private CardNetwork network;

    @Column(nullable = false)
    private String pan;

    @Column(nullable = false)
    private LocalDate expirationDate;

    @Column(nullable = false)
    private String cvv;

    @Column(nullable = false, name = "is_frozen")
    private boolean isFrozen = false;

    public Card() {
    }

    public Card(Account account, CardType type, CardNetwork network, String pan, LocalDate expirationDate,
            String cvv) {
        this.account = account;
        this.type = type;
        this.network = network;
        this.pan = pan;
        this.expirationDate = expirationDate;
        this.cvv = cvv;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Account getAccount() {
        return account;
    }

    public void setType(CardType type) {
        this.type = type;
    }

    public CardType getType() {
        return type;
    }

    public void setNetwork(CardNetwork network) {
        this.network = network;
    }

    public CardNetwork getNetwork() {
        return network;
    }

    public void setPan(String pan) {
        this.pan = pan;
    }

    public String getPan() {
        return pan;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getCvv() {
        return cvv;
    }

    public boolean isFrozen() {
        return isFrozen;
    }

    public void setFrozen(boolean frozen) {
        isFrozen = frozen;
    }

}
