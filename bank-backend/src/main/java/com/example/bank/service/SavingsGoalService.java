package com.example.bank.service;

import com.example.bank.model.*;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.SavingsGoalRepository;
import com.example.bank.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public SavingsGoalService(SavingsGoalRepository savingsGoalRepository, AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<SavingsGoal> getGoalsByAccountId(Long accountId) {
        return savingsGoalRepository.findByAccountId(accountId);
    }

    @Transactional
    public SavingsGoal createGoal(Account account, String name, BigDecimal targetAmount) {
        SavingsGoal goal = new SavingsGoal(name, targetAmount, BigDecimal.ZERO, account);
        return savingsGoalRepository.save(goal);
    }

    @Transactional
    public void deposit(Long goalId, BigDecimal amount) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Obiettivo non trovato"));

        Account account = goal.getAccount();
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Saldo insufficiente sul conto principale");
        }

        // Update amounts
        account.setBalance(account.getBalance().subtract(amount));
        goal.setCurrentAmount(goal.getCurrentAmount().add(amount));

        accountRepository.save(account);
        savingsGoalRepository.save(goal);

        // Record a transaction for the main account
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(TransactionType.OUT);
        transaction.setAmount(amount);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription("Accantonamento salvadanaio: " + goal.getName());
        transaction.setCategory(TransactionCategory.RISPARMIO);
        transactionRepository.save(transaction);
    }

    @Transactional
    public void withdraw(Long goalId, BigDecimal amount) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Obiettivo non trovato"));

        if (goal.getCurrentAmount().compareTo(amount) < 0) {
            throw new RuntimeException("Fondi insufficienti nel salvadanaio");
        }

        // Update amounts
        goal.setCurrentAmount(goal.getCurrentAmount().subtract(amount));
        Account account = goal.getAccount();
        account.setBalance(account.getBalance().add(amount));

        savingsGoalRepository.save(goal);
        accountRepository.save(account);

        // Record a transaction for the main account
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(TransactionType.IN);
        transaction.setAmount(amount);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription("Prelievo da salvadanaio: " + goal.getName());
        transaction.setCategory(TransactionCategory.RISPARMIO);
        transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteGoal(Long goalId) {
        SavingsGoal goal = savingsGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Obiettivo non trovato"));

        // If there are still funds, move them back to account
        if (goal.getCurrentAmount().compareTo(BigDecimal.ZERO) > 0) {
            withdraw(goalId, goal.getCurrentAmount());
        }

        savingsGoalRepository.delete(goal);
    }
}
