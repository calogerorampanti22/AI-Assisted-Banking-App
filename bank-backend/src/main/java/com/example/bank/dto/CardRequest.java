package com.example.bank.dto;

import com.example.bank.model.CardNetwork;
import com.example.bank.model.CardType;

public class CardRequest {
    private CardType type;
    private CardNetwork network;

    public CardType getType() {
        return type;
    }

    public void setType(CardType type) {
        this.type = type;
    }

    public CardNetwork getNetwork() {
        return network;
    }

    public void setNetwork(CardNetwork network) {
        this.network = network;
    }
}
