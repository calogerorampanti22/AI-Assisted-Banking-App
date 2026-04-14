package com.example.bank.controller;

import com.example.bank.dto.BeneficiaryRequest;
import com.example.bank.model.Account;
import com.example.bank.model.Beneficiary;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.BeneficiaryService;
import com.example.bank.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;
    private final UserService userService;
    private final AccountRepository accountRepository;

    public BeneficiaryController(BeneficiaryService beneficiaryService, UserService userService,
            AccountRepository accountRepository) {
        this.beneficiaryService = beneficiaryService;
        this.userService = userService;
        this.accountRepository = accountRepository;
    }

    private Account getCurrentUserAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails userDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        User user = userService.findByEmail(userDetails.getUsername());
        return accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account non trovato"));
    }

    @GetMapping
    public ResponseEntity<List<Beneficiary>> getBeneficiaries() {
        Account account = getCurrentUserAccount();
        return ResponseEntity.ok(beneficiaryService.getBeneficiaries(account.getId()));
    }

    @PostMapping
    public ResponseEntity<Beneficiary> addBeneficiary(@RequestBody BeneficiaryRequest request) {
        Account account = getCurrentUserAccount();
        Beneficiary beneficiary = beneficiaryService.addBeneficiary(
                account.getId(),
                request.getFirstName(),
                request.getLastName(),
                request.getIban());
        return ResponseEntity.ok(beneficiary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeneficiary(@PathVariable Long id) {
        Account account = getCurrentUserAccount();
        beneficiaryService.deleteBeneficiary(id, account.getId());
        return ResponseEntity.noContent().build();
    }
}