package com.example.bank.controller;

import com.example.bank.dto.PhoneTopUpRequest;
import com.example.bank.model.PhoneContact;
import com.example.bank.model.User;
import com.example.bank.repository.PhoneContactRepository;
import com.example.bank.service.PhoneTopUpService;
import com.example.bank.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/phone-topups")
public class PhoneTopUpController {

    private final PhoneTopUpService phoneTopUpService;
    private final UserService userService;
    private final PhoneContactRepository phoneContactRepository;

    public PhoneTopUpController(PhoneTopUpService phoneTopUpService,
            UserService userService,
            PhoneContactRepository phoneContactRepository) {
        this.phoneTopUpService = phoneTopUpService;
        this.userService = userService;
        this.phoneContactRepository = phoneContactRepository;
    }

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails userDetails)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Utente non autenticato");
        }
        return userService.findByEmail(userDetails.getUsername());
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<PhoneContact>> getContacts() {
        User user = getCurrentUser();
        return ResponseEntity.ok(phoneContactRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Object> topUp(@RequestBody PhoneTopUpRequest request) {
        try {
            User user = getCurrentUser();
            phoneTopUpService.processTopUp(user, request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
