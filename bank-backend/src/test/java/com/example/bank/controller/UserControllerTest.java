package com.example.bank.controller;

import com.example.bank.dto.PasswordUpdateDto;
import com.example.bank.model.User;
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

class UserControllerTest {

    private UserController userController;

    @Mock
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userController = new UserController(userService);
        
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");
        
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getMyProfile_Success() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        when(userService.findByEmail("test@test.com")).thenReturn(user);

        ResponseEntity<Object> response = userController.getMyProfile();
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void changePassword_Success() {
        User user = new User();
        user.setId(1L);
        when(userService.findByEmail("test@test.com")).thenReturn(user);

        PasswordUpdateDto dto = new PasswordUpdateDto();
        dto.setOldPassword("old");
        dto.setNewPassword("new");

        ResponseEntity<Object> response = userController.changePassword(dto);
        assertEquals(200, response.getStatusCode().value());
        verify(userService).updatePassword(1L, "old", "new");
    }
}
