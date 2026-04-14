package com.example.bank.service;

import com.example.bank.model.Role;
import com.example.bank.model.User;
import com.example.bank.model.Account;
import com.example.bank.repository.UserRepository;
import com.example.bank.repository.AccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final CardService cardService;

    public UserService(UserRepository userRepository, AccountRepository accountRepository,
            PasswordEncoder passwordEncoder, CardService cardService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.cardService = cardService;
    }

    @Transactional
    public User registerUser(String rawPassword, BigDecimal initialDeposit,
            String firstName, String lastName, String nationality, LocalDate birthday, String birthPlace,
            String idCardNumber, String taxId, String email) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email già registrata");
        }

        User user = new User(passwordEncoder.encode(rawPassword), Role.USER,
                firstName, lastName, nationality, birthday, birthPlace, idCardNumber, taxId, email);
        User savedUser = userRepository.save(user);

        // Generate IBAN/account number (simplified for demo)
        String accountNumber = "IT" + UUID.randomUUID().toString().replace("-", "").substring(0, 22).toUpperCase();

        Account account = new Account(accountNumber, initialDeposit != null ? initialDeposit : BigDecimal.ZERO,
                savedUser);
        account = accountRepository.save(account);

        savedUser.setAccount(account);

        // Genera automaticamente una carta associata al nuovo account
        cardService.addCard(account.getId());

        return savedUser;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("La vecchia password non è corretta");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
