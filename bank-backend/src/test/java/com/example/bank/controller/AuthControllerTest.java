package com.example.bank.controller;

import com.example.bank.dto.LoginRequest;
import com.example.bank.dto.RegisterRequest;
import com.example.bank.model.Role;
import com.example.bank.model.User;
import com.example.bank.repository.LoginHistoryRepository;
import com.example.bank.security.jwt.JwtUtils;
import com.example.bank.service.TokenBlacklistService;
import com.example.bank.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private LoginHistoryRepository loginHistoryRepository;

    @Mock
    private TokenBlacklistService tokenBlacklistService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authController = new AuthController(authenticationManager, userService, jwtUtils, loginHistoryRepository, tokenBlacklistService);
    }

    @Test
    void registerUser_Success() {
        RegisterRequest request = new RegisterRequest();
        ResponseEntity<Object> response = authController.registerUser(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void registerUser_Failure() {
        doThrow(new RuntimeException("Error")).when(userService).registerUser(any(RegisterRequest.class));
        RegisterRequest request = new RegisterRequest();
        ResponseEntity<Object> response = authController.registerUser(request);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void loginUser_Success() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password");
        HttpServletRequest request = mock(HttpServletRequest.class);

        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setRole(Role.USER);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        when(userService.findByEmail("test@test.com")).thenReturn(user);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        ResponseEntity<Object> response = authController.authenticateUser(loginRequest, request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void loginUser_InvalidDetails() {
        LoginRequest loginRequest = new LoginRequest();
        HttpServletRequest request = mock(HttpServletRequest.class);
        Authentication authentication = mock(Authentication.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("Invalid");

        ResponseEntity<Object> response = authController.authenticateUser(loginRequest, request);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void loginUser_UserNotFound() {
        LoginRequest loginRequest = new LoginRequest();
        HttpServletRequest request = mock(HttpServletRequest.class);
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        when(userService.findByEmail("test@test.com")).thenReturn(null);

        ResponseEntity<Object> response = authController.authenticateUser(loginRequest, request);
        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void logoutUser_Success() {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getHeader("Authorization")).thenReturn("Bearer token");
        
        ResponseEntity<String> response = authController.logoutUser(request);
        assertEquals(200, response.getStatusCode().value());
        verify(tokenBlacklistService).blacklist("token");
    }
}
