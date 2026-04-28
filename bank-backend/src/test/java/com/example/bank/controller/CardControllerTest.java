package com.example.bank.controller;

import com.example.bank.dto.CardRequest;
import com.example.bank.model.Account;
import com.example.bank.model.User;
import com.example.bank.model.CardNetwork;
import com.example.bank.model.CardType;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.CardService;
import com.example.bank.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CardControllerTest {

    private CardController cardController;

    @Mock
    private CardService cardService;

    @Mock
    private UserService userService;

    @Mock
    private AccountRepository accountRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        cardController = new CardController(cardService, userService, accountRepository);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        User user = new User();
        user.setId(1L);
        when(userService.findByEmail("test@test.com")).thenReturn(user);

        Account account = new Account();
        account.setId(10L);
        when(accountRepository.findByUserId(1L)).thenReturn(Optional.of(account));
    }

    @Test
    void getCards_Success() {
        ResponseEntity<?> response = cardController.getCards();
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void requestNewCard_Success() {
        CardRequest request = new CardRequest();
        request.setType(CardType.DEBIT);
        request.setNetwork(CardNetwork.VISA);

        ResponseEntity<?> response = cardController.requestNewCard(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void freezeCard_Success() {
        ResponseEntity<?> response = cardController.freezeCard(1L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void unfreezeCard_Success() {
        ResponseEntity<?> response = cardController.unfreezeCard(1L);
        assertEquals(200, response.getStatusCode().value());
    }
}
