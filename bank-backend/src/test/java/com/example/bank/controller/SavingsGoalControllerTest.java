package com.example.bank.controller;

import com.example.bank.dto.SavingsGoalRequest;
import com.example.bank.model.Account;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.SavingsGoalService;
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

class SavingsGoalControllerTest {

    private SavingsGoalController savingsGoalController;

    @Mock
    private SavingsGoalService savingsGoalService;

    @Mock
    private UserService userService;

    @Mock
    private AccountRepository accountRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        savingsGoalController = new SavingsGoalController(savingsGoalService, userService, accountRepository);

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
    void getGoals_Success() {
        ResponseEntity<java.util.List<com.example.bank.model.SavingsGoal>> response = savingsGoalController.getGoals();
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void createGoal_Success() {
        SavingsGoalRequest request = new SavingsGoalRequest();
        request.setName("car");
        ResponseEntity<com.example.bank.model.SavingsGoal> response = savingsGoalController.createGoal(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void deposit_Success() {
        SavingsGoalRequest request = new SavingsGoalRequest();
        ResponseEntity<Object> response = savingsGoalController.deposit(1L, request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void delete_Success() {
        ResponseEntity<Object> response = savingsGoalController.deleteGoal(1L);
        assertEquals(200, response.getStatusCode().value());
    }
}
