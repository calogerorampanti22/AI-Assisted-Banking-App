package com.example.bank.service;

import com.example.bank.dto.PhoneTopUpRequest;
import com.example.bank.model.Account;
import com.example.bank.model.PhoneContact;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.PhoneContactRepository;
import com.example.bank.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PhoneTopUpServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private PhoneContactRepository phoneContactRepository;

    @InjectMocks
    private PhoneTopUpService phoneTopUpService;

    private User testUser;
    private Account testAccount;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);

        testAccount = new Account();
        testAccount.setId(1L);
        testAccount.setBalance(new BigDecimal("50.00"));
    }

    @Test
    void processTopUp_Success() {
        PhoneTopUpRequest request = new PhoneTopUpRequest();
        request.setAmount(new BigDecimal("10.00"));
        request.setPhoneNumber("1234567890");
        request.setOperator("Vodafone");
        request.setSaveContact(true);
        request.setContactName("Mamma");

        when(accountRepository.findByUserId(1L)).thenReturn(Optional.of(testAccount));

        phoneTopUpService.processTopUp(testUser, request);

        assertEquals(new BigDecimal("40.00"), testAccount.getBalance());
        verify(accountRepository).save(testAccount);
        verify(transactionRepository).save(any());
        verify(phoneContactRepository).save(any(PhoneContact.class));
    }

    @Test
    void processTopUp_AccountNotFound() {
        PhoneTopUpRequest request = new PhoneTopUpRequest();
        when(accountRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> phoneTopUpService.processTopUp(testUser, request));
    }

    @Test
    void processTopUp_InsufficientBalance() {
        PhoneTopUpRequest request = new PhoneTopUpRequest();
        request.setAmount(new BigDecimal("100.00"));

        when(accountRepository.findByUserId(1L)).thenReturn(Optional.of(testAccount));

        assertThrows(ResponseStatusException.class, () -> phoneTopUpService.processTopUp(testUser, request));
    }
}
