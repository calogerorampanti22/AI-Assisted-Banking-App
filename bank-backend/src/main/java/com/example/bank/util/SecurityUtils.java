package com.example.bank.util;

import com.example.bank.model.Account;
import com.example.bank.model.User;
import com.example.bank.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class SecurityUtils {

    private final UserService userService;

    public SecurityUtils(UserService userService) {
        this.userService = userService;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utente non autenticato");
        }
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Dettagli utente non validi");
        }
        UserDetails userDetails = (UserDetails) principal;
        return userService.findByEmail(userDetails.getUsername());
    }

    public Account getCurrentUserAccount() {
        User user = getCurrentUser();
        Account account = user.getAccount();
        if (account == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Account non trovato per l'utente corrente");
        }
        return account;
    }
}
