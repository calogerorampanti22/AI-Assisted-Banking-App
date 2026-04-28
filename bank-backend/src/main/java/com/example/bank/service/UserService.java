package com.example.bank.service;

import com.example.bank.dto.RegisterRequest;
import com.example.bank.model.Account;
import com.example.bank.model.Role;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email già registrata");
        }

        User user = new User.Builder()
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .nationality(request.getNationality())
                .birthday(request.getBirthday())
                .birthPlace(request.getBirthPlace())
                .idCardNumber(request.getIdCardNumber())
                .taxId(request.getTaxId())
                .email(request.getEmail())
                .build();
        User savedUser = userRepository.save(user);

        // Generate IBAN/account number (simplified for demo)
        String accountNumber = "IT" + UUID.randomUUID().toString().replace("-", "").substring(0, 22).toUpperCase();

        Account account = new Account(accountNumber, request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO,
                savedUser);
        account = accountRepository.save(account);

        savedUser.setAccount(account);

        // Genera automaticamente una carta associata al nuovo account
        cardService.addCard(account.getId());

        return savedUser;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("La vecchia password non è corretta");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
