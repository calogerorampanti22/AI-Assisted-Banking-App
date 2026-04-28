package com.example.bank.controller;

import com.example.bank.dto.PhoneTopUpRequest;
import com.example.bank.model.User;
import com.example.bank.repository.PhoneContactRepository;
import com.example.bank.service.PhoneTopUpService;
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

class PhoneTopUpControllerTest {

    private PhoneTopUpController phoneTopUpController;

    @Mock
    private PhoneTopUpService phoneTopUpService;

    @Mock
    private UserService userService;

    @Mock
    private PhoneContactRepository phoneContactRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        phoneTopUpController = new PhoneTopUpController(phoneTopUpService, userService, phoneContactRepository);

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
    void getContacts_Success() {
        ResponseEntity<?> response = phoneTopUpController.getContacts();
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void topUp_Success() {
        PhoneTopUpRequest request = new PhoneTopUpRequest();
        ResponseEntity<?> response = phoneTopUpController.topUp(request);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void topUp_Failure() {
        PhoneTopUpRequest request = new PhoneTopUpRequest();
        doThrow(new RuntimeException("Error")).when(phoneTopUpService).processTopUp(any(User.class), any(PhoneTopUpRequest.class));
        
        ResponseEntity<?> response = phoneTopUpController.topUp(request);
        assertEquals(400, response.getStatusCode().value());
    }
}
