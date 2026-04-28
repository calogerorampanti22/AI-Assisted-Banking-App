package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.Card;
import com.example.bank.model.CardNetwork;
import com.example.bank.model.CardType;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.CardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CardServiceTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private CardService cardService;

    private Account testAccount;
    private Card testCard;

    @BeforeEach
    void setUp() {
        testAccount = new Account();
        testAccount.setId(1L);

        testCard = new Card();
        testCard.setId(1L);
        testCard.setAccount(testAccount);
        testCard.setFrozen(false);
    }

    @Test
    void addCard_Default_Success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(cardRepository.save(any(Card.class))).thenReturn(testCard);

        Card result = cardService.addCard(1L);

        assertNotNull(result);
        verify(cardRepository).save(any(Card.class));
    }

    @Test
    void addCard_Custom_Success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(cardRepository.save(any(Card.class))).thenReturn(testCard);

        Card result = cardService.addCard(1L, CardType.CREDIT, CardNetwork.MARSTERCARD);

        assertNotNull(result);
        verify(cardRepository).save(any(Card.class));
    }

    @Test
    void addCard_AccountNotFound() {
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> cardService.addCard(1L));
    }

    @Test
    void getCards() {
        when(cardRepository.findByAccountId(1L)).thenReturn(List.of(testCard));
        List<Card> result = cardService.getCards(1L);
        assertEquals(1, result.size());
    }

    @Test
    void freezeCard_Success() {
        when(cardRepository.findById(1L)).thenReturn(Optional.of(testCard));
        when(cardRepository.save(any(Card.class))).thenReturn(testCard);

        Card result = cardService.freezeCard(1L, 1L);

        assertTrue(result.isFrozen());
        verify(cardRepository).save(testCard);
    }

    @Test
    void freezeCard_Forbidden() {
        when(cardRepository.findById(1L)).thenReturn(Optional.of(testCard));
        assertThrows(ResponseStatusException.class, () -> cardService.freezeCard(1L, 2L));
    }

    @Test
    void unfreezeCard_Success() {
        testCard.setFrozen(true);
        when(cardRepository.findById(1L)).thenReturn(Optional.of(testCard));
        when(cardRepository.save(any(Card.class))).thenReturn(testCard);

        Card result = cardService.unfreezeCard(1L, 1L);

        assertFalse(result.isFrozen());
        verify(cardRepository).save(testCard);
    }
}
