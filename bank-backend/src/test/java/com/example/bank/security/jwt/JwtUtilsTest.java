package com.example.bank.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private String secret = Base64.getEncoder().encodeToString("testSecretWithAtLeast32CharactersForHS256Algorithm1234567890".getBytes());

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", secret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000);
    }

    @Test
    void generateAndValidateToken_Success() {
        Authentication auth = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        String token = jwtUtils.generateJwtToken(auth);
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("test@test.com", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void validateToken_Failure() {
        assertFalse(jwtUtils.validateJwtToken("invalid-token"));
    }

    @Test
    void generateToken_InvalidPrincipal() {
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn("NotUserDetails");
        assertThrows(IllegalArgumentException.class, () -> jwtUtils.generateJwtToken(auth));
    }
}
