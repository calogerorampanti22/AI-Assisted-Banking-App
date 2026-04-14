package com.example.bank.service;

import com.example.bank.dto.BillPaymentRequest;
import com.example.bank.dto.TransferRequest;
import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.model.TransactionCategory;
import com.example.bank.model.TransactionType;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public TransactionService(TransactionRepository transactionRepository, AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public Transaction processTransfer(Long accountId, TransferRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account non trovato"));

        TransactionType type = TransactionType.valueOf(request.getType().toUpperCase());
        BigDecimal amount = request.getAmount();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("L'importo deve essere positivo");
        }

        if (type == TransactionType.OUT) {
            if (account.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Saldo insufficiente");
            }

            // Find recipient by IBAN
            Account recipientAccount = accountRepository.findByAccountNumber(request.getRelatedAccountNumber())
                    .orElseThrow(() -> new RuntimeException("Destinazione IBAN non trovata."));

            // Validate recipient Name and Surname (case-insensitive)
            if (!recipientAccount.getUser().getFirstName().equalsIgnoreCase(request.getRecipientFirstName()) ||
                    !recipientAccount.getUser().getLastName().equalsIgnoreCase(request.getRecipientLastName())) {
                throw new RuntimeException("Nome o cognome del beneficiario non corrispondenti all'IBAN.");
            }

            // Perform transfer
            account.setBalance(account.getBalance().subtract(amount));
            recipientAccount.setBalance(recipientAccount.getBalance().add(amount));

            accountRepository.save(account);
            accountRepository.save(recipientAccount);

            // Create incoming transaction record for recipient
            Transaction incomingTx = new Transaction();
            incomingTx.setAccount(recipientAccount);
            incomingTx.setType(TransactionType.IN);
            incomingTx.setAmount(amount);
            incomingTx.setDate(LocalDateTime.now());
            incomingTx.setDescription(
                    "Bonifico da " + account.getUser().getFirstName() + " " + account.getUser().getLastName());
            incomingTx.setRelatedAccountNumber(account.getAccountNumber());
            incomingTx.setRecipientFirstName(account.getUser().getFirstName());
            incomingTx.setRecipientLastName(account.getUser().getLastName());
            incomingTx.setCategory(TransactionCategory.BONIFICO);
            transactionRepository.save(incomingTx);

        } else if (type == TransactionType.IN) {
            account.setBalance(account.getBalance().add(amount));
            accountRepository.save(account);
        }

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription(request.getDescription());
        transaction.setRelatedAccountNumber(request.getRelatedAccountNumber());
        transaction.setRecipientFirstName(request.getRecipientFirstName());
        transaction.setRecipientLastName(request.getRecipientLastName());
        transaction.setCategory(TransactionCategory.BONIFICO);

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactions(Long accountId, LocalDateTime startDate, LocalDateTime endDate,
            String typeStr) {
        TransactionType type = typeStr != null && !typeStr.isEmpty() ? TransactionType.valueOf(typeStr.toUpperCase())
                : null;
        return transactionRepository.findFilteredTransactions(accountId, startDate, endDate, type);
    }

    @Transactional
    public Transaction processBillPayment(Long accountId, BillPaymentRequest request) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account non trovato"));

        BigDecimal amount = request.getAmount();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("L'importo deve essere positivo");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Saldo insufficiente per completare il pagamento");
        }

        // Deducing balance from user account
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        // Formattiamo il nome dell'Ente in base al tipo
        String billerInfo = request.getCategory() + " - " + request.getBillerName();

        // Create the OUT transaction for the bill
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType(TransactionType.OUT);
        transaction.setAmount(amount);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription(request.getDescription());
        transaction.setRelatedAccountNumber(request.getBillReferenceNumber());
        transaction.setRecipientFirstName("Ente Creditore");
        transaction.setRecipientLastName(billerInfo);
        transaction.setCategory(request.getCategory() != null ? request.getCategory() : TransactionCategory.BOLLETTINO);

        return transactionRepository.save(transaction);
    }
}
