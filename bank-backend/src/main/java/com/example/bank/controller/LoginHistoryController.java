package com.example.bank.controller;

import com.example.bank.model.LoginHistory;
import com.example.bank.model.User;
import com.example.bank.repository.LoginHistoryRepository;
import com.example.bank.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/login-history")
public class LoginHistoryController {

    private final LoginHistoryRepository loginHistoryRepository;
    private final UserService userService;

    public LoginHistoryController(LoginHistoryRepository loginHistoryRepository, UserService userService) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<LoginHistory>> getLoginHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails userDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        User user = userService.findByEmail(userDetails.getUsername());

        List<LoginHistory> history = loginHistoryRepository.findByUserIdOrderByLoginDateDesc(user.getId());
        return ResponseEntity.ok(history);
    }
}
