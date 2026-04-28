package com.example.bank.service;

import com.example.bank.dto.BillPaymentRequest;
import com.example.bank.dto.TransferRequest;
import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Account testAccount;
    private Account recipientAccount;

    @BeforeEach
    void setUp() {
        User user1 = new User();
        user1.setFirstName("John");
        user1.setLastName("Doe");

        User user2 = new User();
        user2.setFirstName("Jane");
        user2.setLastName("Smith");

        testAccount = new Account();
        testAccount.setId(1L);
        testAccount.setBalance(new BigDecimal("1000.00"));
        testAccount.setAccountNumber("IBAN123");
        testAccount.setUser(user1);

        recipientAccount = new Account();
        recipientAccount.setId(2L);
        recipientAccount.setBalance(new BigDecimal("500.00"));
        recipientAccount.setAccountNumber("IBAN456");
        recipientAccount.setUser(user2);
    }

    @Test
    void getTransactions_CallsRepository() {
        LocalDateTime start = LocalDateTime.now().minusDays(1);
        LocalDateTime end = LocalDateTime.now();

        when(transactionRepository.findFilteredTransactions(eq(1L), any(), any(), any()))
                .thenReturn(List.of(new Transaction()));

        List<Transaction> result = transactionService.getTransactions(1L, start, end, "OUT");
        assertFalse(result.isEmpty());
    }

    @Test
    void processTransfer_Out_Success() {
        TransferRequest request = new TransferRequest();
        request.setType("OUT");
        request.setAmount(new BigDecimal("200.00"));
        request.setRelatedAccountNumber("IBAN456");
        request.setRecipientFirstName("Jane");
        request.setRecipientLastName("Smith");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(accountRepository.findByAccountNumber("IBAN456")).thenReturn(Optional.of(recipientAccount));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArgument(0));

        Transaction result = transactionService.processTransfer(1L, request);

        assertNotNull(result);
        assertEquals(new BigDecimal("800.00"), testAccount.getBalance());
        assertEquals(new BigDecimal("700.00"), recipientAccount.getBalance());
        verify(accountRepository).save(testAccount);
        verify(accountRepository).save(recipientAccount);
        verify(transactionRepository, times(2)).save(any(Transaction.class)); // One for sender, one for recipient
    }

    @Test
    void processTransfer_InsufficientBalance() {
        TransferRequest request = new TransferRequest();
        request.setType("OUT");
        request.setAmount(new BigDecimal("2000.00"));

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));

        assertThrows(IllegalArgumentException.class, () -> transactionService.processTransfer(1L, request));
    }

    @Test
    void processTransfer_RecipientNotFound() {
        TransferRequest request = new TransferRequest();
        request.setType("OUT");
        request.setAmount(new BigDecimal("200.00"));
        request.setRelatedAccountNumber("IBANXYZ");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(accountRepository.findByAccountNumber("IBANXYZ")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> transactionService.processTransfer(1L, request));
    }

    @Test
    void processTransfer_RecipientNameMismatch() {
        TransferRequest request = new TransferRequest();
        request.setType("OUT");
        request.setAmount(new BigDecimal("200.00"));
        request.setRelatedAccountNumber("IBAN456");
        request.setRecipientFirstName("Wrong");
        request.setRecipientLastName("Name");

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(accountRepository.findByAccountNumber("IBAN456")).thenReturn(Optional.of(recipientAccount));

        assertThrows(IllegalArgumentException.class, () -> transactionService.processTransfer(1L, request));
    }

    @Test
    void processBillPayment_Success() {
        BillPaymentRequest request = new BillPaymentRequest();
        request.setAmount(new BigDecimal("150.00"));

        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> i.getArgument(0));

        Transaction result = transactionService.processBillPayment(1L, request);

        assertNotNull(result);
        assertEquals(new BigDecimal("850.00"), testAccount.getBalance());
        verify(accountRepository).save(testAccount);
    }
}
