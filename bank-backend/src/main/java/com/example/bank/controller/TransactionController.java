package com.example.bank.controller;

import com.example.bank.dto.BillPaymentRequest;
import com.example.bank.dto.TransferRequest;
import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.TransactionService;
import com.example.bank.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;
    private final AccountRepository accountRepository;

    public TransactionController(TransactionService transactionService, UserService userService,
            AccountRepository accountRepository) {
        this.transactionService = transactionService;
        this.userService = userService;
        this.accountRepository = accountRepository;
    }

    private Account getCurrentUserAccount() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails userDetails)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Utente non autenticato");
        }
        User user = userService.findByEmail(userDetails.getUsername());
        return accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Account non trovato"));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(name = "type", required = false) String type) {

        Account account = getCurrentUserAccount();

        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime end = endDate != null ? endDate.atTime(23, 59, 59) : null;

        List<Transaction> transactions = transactionService.getTransactions(account.getId(), start, end, type);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/transfer")
    public ResponseEntity<Object> performTransfer(@RequestBody TransferRequest transferRequest) {
        try {
            Account account = getCurrentUserAccount();
            Transaction transaction = transactionService.processTransfer(account.getId(), transferRequest);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/pay-bill")
    public ResponseEntity<Object> payBill(@RequestBody BillPaymentRequest billPaymentRequest) {
        try {
            Account account = getCurrentUserAccount();
            Transaction transaction = transactionService.processBillPayment(account.getId(), billPaymentRequest);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
