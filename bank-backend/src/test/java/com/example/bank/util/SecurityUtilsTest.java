package com.example.bank.util;

import com.example.bank.model.Account;
import com.example.bank.model.User;
import com.example.bank.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityUtilsTest {

    private SecurityUtils securityUtils;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        securityUtils = new SecurityUtils(userService);
    }

    @Test
    void getCurrentUser_Success() {
        Authentication auth = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        SecurityContext context = mock(SecurityContext.class);
        
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
        
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        
        User user = new User();
        when(userService.findByEmail("test@test.com")).thenReturn(user);

        User result = securityUtils.getCurrentUser();
        assertNotNull(result);
        assertEquals(user, result);
    }

    @Test
    void getCurrentUser_Unauthenticated() {
        SecurityContextHolder.clearContext();
        assertThrows(ResponseStatusException.class, () -> securityUtils.getCurrentUser());
    }

    @Test
    void getCurrentUserAccount_Success() {
        Authentication auth = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        SecurityContext context = mock(SecurityContext.class);
        
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
        
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        
        User user = new User();
        Account account = new Account();
        user.setAccount(account);
        when(userService.findByEmail("test@test.com")).thenReturn(user);

        Account result = securityUtils.getCurrentUserAccount();
        assertEquals(account, result);
    }

    @Test
    void getCurrentUserAccount_NoAccount() {
        Authentication auth = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        SecurityContext context = mock(SecurityContext.class);
        
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
        
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        
        User user = new User();
        user.setAccount(null);
        when(userService.findByEmail("test@test.com")).thenReturn(user);

        assertThrows(ResponseStatusException.class, () -> securityUtils.getCurrentUserAccount());
    }
}
