package com.example.bank.controller;

import com.example.bank.dto.BeneficiaryRequest;
import com.example.bank.model.Account;
import com.example.bank.model.User;
import com.example.bank.repository.AccountRepository;
import com.example.bank.service.BeneficiaryService;
import com.example.bank.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class BeneficiaryControllerTest {

    private BeneficiaryController beneficiaryController;

    @Mock
    private BeneficiaryService beneficiaryService;

    @Mock
    private UserService userService;

    @Mock
    private AccountRepository accountRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        beneficiaryController = new BeneficiaryController(beneficiaryService, userService, accountRepository);

        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        User user = new User();
        user.setId(1L);
        when(userService.findByEmail("test@test.com")).thenReturn(user);

        Account account = new Account();
        account.setId(10L);
        when(accountRepository.findByUserId(1L)).thenReturn(Optional.of(account));
    }

    @Test
    void getBeneficiaries_Success() {
        ResponseEntity<?> response = beneficiaryController.getBeneficiaries();
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void addBeneficiary_Success() {
        BeneficiaryRequest request = new BeneficiaryRequest();
        request.setFirstName("Mario");
        request.setLastName("Rossi");
        request.setIban("IT123");

        ResponseEntity<?> response = beneficiaryController.addBeneficiary(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void deleteBeneficiary_Success() {
        ResponseEntity<?> response = beneficiaryController.deleteBeneficiary(1L);
        assertEquals(204, response.getStatusCode().value());
    }

    @Test
    void getCurrentUserAccount_Unauthenticated() {
        SecurityContextHolder.clearContext();
        assertThrows(ResponseStatusException.class, () -> beneficiaryController.getBeneficiaries());
    }
}
