package com.example.bank.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.bank.model.Account;
import com.example.bank.model.Card;
import com.example.bank.model.CardNetwork;
import com.example.bank.model.CardType;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.CardRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final AccountRepository accountRepository;

    public CardService(CardRepository cardRepository, AccountRepository accountRepository) {
        this.cardRepository = cardRepository;
        this.accountRepository = accountRepository;
    }

    public Card addCard(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account non trovato"));

        CardNetwork network = CardNetwork.VISA;
        CardType type = CardType.DEBIT;

        return createCardInternal(account, type, network);
    }

    public Card addCard(Long accountId, CardType type, CardNetwork network) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account non trovato"));
        return createCardInternal(account, type, network);
    }

    private Card createCardInternal(Account account, CardType type, CardNetwork network) {
        String pan = generatePan(network);

        // Simulo anche data di scadenza e CVV per poter istanziare la carta
        LocalDate expirationDate = LocalDate.now().plusYears(4);
        String cvv = String.format("%03d", new Random().nextInt(1000));

        Card card = new Card(account, type, network, pan, expirationDate, cvv);

        return cardRepository.save(card);
    }

    public List<Card> getCards(Long id) {
        return cardRepository.findByAccountId(id);
    }

    private String generatePan(CardNetwork network) {
        StringBuilder pan = new StringBuilder();

        // Assegniamo il prefisso in base al circuito scelto
        if (network == CardNetwork.VISA) {
            pan.append("4"); // Le carte Visa iniziano sempre con 4
        } else if (network == CardNetwork.MARSTERCARD) {
            pan.append("5"); // Le Mastercard iniziano con 5 (tra 51 e 55)
        } else {
            pan.append("9"); // Caso di default per reti sconosciute
        }

        // Generiamo le restanti 15 cifre per arrivare a 16 totali
        Random random = new Random();
        for (int i = 0; i < 15; i++) {
            pan.append(random.nextInt(10));
        }

        return pan.toString();
    }

    public Card freezeCard(Long cardId, Long accountId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carta non trovata"));

        if (!card.getAccount().getId().equals(accountId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non sei autorizzato a modificare questa carta");
        }

        card.setFrozen(true);
        return cardRepository.save(card);
    }

    public Card unfreezeCard(Long cardId, Long accountId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carta non trovata"));

        if (!card.getAccount().getId().equals(accountId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non sei autorizzato a modificare questa carta");
        }

        card.setFrozen(false);
        return cardRepository.save(card);
    }
}
