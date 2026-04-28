package com.example.bank.controller;

import com.example.bank.model.User;
import com.example.bank.repository.LoginHistoryRepository;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class LoginHistoryControllerTest {

    private LoginHistoryController loginHistoryController;

    @Mock
    private LoginHistoryRepository loginHistoryRepository;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        loginHistoryController = new LoginHistoryController(loginHistoryRepository, userService);

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
    }

    @Test
    void getLoginHistory_Success() {
        ResponseEntity<?> response = loginHistoryController.getLoginHistory();
        assertEquals(200, response.getStatusCode().value());
    }
}
