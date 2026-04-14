package com.example.bank.service;

import com.example.bank.dto.PhoneTopUpRequest;
import com.example.bank.model.*;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.PhoneContactRepository;
import com.example.bank.repository.TransactionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class PhoneTopUpService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PhoneContactRepository phoneContactRepository;

    public PhoneTopUpService(AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            PhoneContactRepository phoneContactRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.phoneContactRepository = phoneContactRepository;
    }

    @Transactional
    public void processTopUp(User user, PhoneTopUpRequest request) {
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account non trovato"));

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Saldo insufficiente");
        }

        // Deduct amount
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        // Record transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(TransactionType.OUT);
        transaction.setAmount(request.getAmount());
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription(
                "Ricarica telefonica: " + request.getPhoneNumber() + " (" + request.getOperator() + ")");
        transaction.setCategory(TransactionCategory.RICARICA);
        transactionRepository.save(transaction);

        // Optionally save contact
        if (request.isSaveContact()) {
            PhoneContact contact = new PhoneContact(
                    request.getContactName() != null ? request.getContactName() : request.getPhoneNumber(),
                    request.getPhoneNumber(),
                    request.getOperator(),
                    user);
            phoneContactRepository.save(contact);
        }
    }
}
