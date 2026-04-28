package com.example.bank.controller;

import com.example.bank.dto.BillPaymentRequest;
import com.example.bank.dto.TransferRequest;
import com.example.bank.model.Account;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.TransactionService;
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

class TransactionControllerTest {

    private TransactionController transactionController;

    @Mock
    private TransactionService transactionService;

    @Mock
    private UserService userService;

    @Mock
    private AccountRepository accountRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        transactionController = new TransactionController(transactionService, userService, accountRepository);

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
    void getTransactions_Success() {
        ResponseEntity<java.util.List<com.example.bank.model.Transaction>> response = transactionController.getTransactions(null, null, null);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void performTransfer_Success() {
        TransferRequest request = new TransferRequest();
        ResponseEntity<Object> response = transactionController.performTransfer(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void performTransfer_Failure() {
        TransferRequest request = new TransferRequest();
        when(transactionService.processTransfer(anyLong(), any(TransferRequest.class))).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<Object> response = transactionController.performTransfer(request);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void payBill_Success() {
        BillPaymentRequest request = new BillPaymentRequest();
        ResponseEntity<Object> response = transactionController.payBill(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void payBill_Failure() {
        BillPaymentRequest request = new BillPaymentRequest();
        when(transactionService.processBillPayment(anyLong(), any(BillPaymentRequest.class))).thenThrow(new RuntimeException("Error"));
        
        ResponseEntity<Object> response = transactionController.payBill(request);
        assertEquals(400, response.getStatusCode().value());
    }
}
