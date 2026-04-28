package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.SavingsGoal;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.SavingsGoalRepository;
import com.example.bank.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SavingsGoalServiceTest {

    @Mock
    private SavingsGoalRepository savingsGoalRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private SavingsGoalService savingsGoalService;

    private Account testAccount;
    private SavingsGoal testGoal;

    @BeforeEach
    void setUp() {
        testAccount = new Account();
        testAccount.setId(1L);
        testAccount.setBalance(new BigDecimal("100.00"));

        testGoal = new SavingsGoal("Vacation", new BigDecimal("500.00"), new BigDecimal("50.00"), testAccount);
        testGoal.setId(1L);
    }

    @Test
    void getGoalsByAccountId() {
        when(savingsGoalRepository.findByAccountId(1L)).thenReturn(List.of(testGoal));
        List<SavingsGoal> result = savingsGoalService.getGoalsByAccountId(1L);
        assertEquals(1, result.size());
    }

    @Test
    void createGoal() {
        when(savingsGoalRepository.save(any(SavingsGoal.class))).thenReturn(testGoal);
        SavingsGoal result = savingsGoalService.createGoal(testAccount, "Vacation", new BigDecimal("500.00"));
        assertNotNull(result);
        verify(savingsGoalRepository).save(any(SavingsGoal.class));
    }

    @Test
    void deposit_Success() {
        when(savingsGoalRepository.findById(1L)).thenReturn(Optional.of(testGoal));
        
        savingsGoalService.deposit(1L, new BigDecimal("20.00"));
        
        assertEquals(new BigDecimal("80.00"), testAccount.getBalance());
        assertEquals(new BigDecimal("70.00"), testGoal.getCurrentAmount());
        verify(accountRepository).save(testAccount);
        verify(savingsGoalRepository).save(testGoal);
        verify(transactionRepository).save(any());
    }

    @Test
    void deposit_InsufficientFunds() {
        when(savingsGoalRepository.findById(1L)).thenReturn(Optional.of(testGoal));
        BigDecimal amount = new BigDecimal("200.00");
        assertThrows(IllegalArgumentException.class, () -> savingsGoalService.deposit(1L, amount));
    }

    @Test
    void withdraw_Success() {
        when(savingsGoalRepository.findById(1L)).thenReturn(Optional.of(testGoal));
        
        savingsGoalService.withdraw(1L, new BigDecimal("20.00"));
        
        assertEquals(new BigDecimal("120.00"), testAccount.getBalance());
        assertEquals(new BigDecimal("30.00"), testGoal.getCurrentAmount());
        verify(accountRepository).save(testAccount);
        verify(savingsGoalRepository).save(testGoal);
        verify(transactionRepository).save(any());
    }

    @Test
    void withdraw_InsufficientFunds() {
        when(savingsGoalRepository.findById(1L)).thenReturn(Optional.of(testGoal));
        BigDecimal amount = new BigDecimal("60.00");
        assertThrows(IllegalArgumentException.class, () -> savingsGoalService.withdraw(1L, amount));
    }

    @Test
    void deleteGoal_WithFunds() {
        when(savingsGoalRepository.findById(1L)).thenReturn(Optional.of(testGoal));
        
        savingsGoalService.deleteGoal(1L);
        
        assertEquals(new BigDecimal("150.00"), testAccount.getBalance());
        assertEquals(0, testGoal.getCurrentAmount().compareTo(BigDecimal.ZERO));
        verify(savingsGoalRepository).delete(testGoal);
    }
}
