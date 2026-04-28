package com.example.bank.controller;

import com.example.bank.dto.SavingsGoalRequest;
import com.example.bank.model.Account;
import com.example.bank.model.SavingsGoal;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.SavingsGoalService;
import com.example.bank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;
    private final UserService userService;
    private final AccountRepository accountRepository;

    public SavingsGoalController(SavingsGoalService savingsGoalService, UserService userService,
            AccountRepository accountRepository) {
        this.savingsGoalService = savingsGoalService;
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
    public ResponseEntity<List<SavingsGoal>> getGoals() {
        Account account = getCurrentUserAccount();
        return ResponseEntity.ok(savingsGoalService.getGoalsByAccountId(account.getId()));
    }

    @PostMapping
    public ResponseEntity<SavingsGoal> createGoal(@RequestBody SavingsGoalRequest request) {
        Account account = getCurrentUserAccount();
        return ResponseEntity.ok(savingsGoalService.createGoal(account, request.getName(), request.getTargetAmount()));
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<Object> deposit(@PathVariable Long id, @RequestBody SavingsGoalRequest request) {
        try {
            savingsGoalService.deposit(id, request.getAmount());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Object> withdraw(@PathVariable Long id, @RequestBody SavingsGoalRequest request) {
        try {
            savingsGoalService.withdraw(id, request.getAmount());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteGoal(@PathVariable Long id) {
        try {
            savingsGoalService.deleteGoal(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
