package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.User;
import com.example.bank.model.Role;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CardService cardService;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@test.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(Role.USER);
    }

    @Test
    void registerUser_Success() {
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(2L);
            return u;
        });
        when(accountRepository.save(any(Account.class))).thenAnswer(i -> {
            Account a = i.getArgument(0);
            a.setId(10L);
            return a;
        });

        com.example.bank.dto.RegisterRequest regReq = new com.example.bank.dto.RegisterRequest();
        regReq.setPassword("password");
        regReq.setInitialDeposit(BigDecimal.ZERO);
        regReq.setFirstName("John");
        regReq.setLastName("Doe");
        regReq.setNationality("Italian");
        regReq.setBirthday(LocalDate.now());
        regReq.setBirthPlace("Rome");
        regReq.setIdCardNumber("ID123");
        regReq.setTaxId("TAX123");
        regReq.setEmail("new@test.com");

        User result = userService.registerUser(regReq);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        verify(cardService).addCard(10L);
        verify(userRepository).save(any(User.class));
        verify(accountRepository).save(any(Account.class));
    }

    @Test
    void findByEmail_Success() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(testUser));
        User result = userService.findByEmail("test@test.com");
        assertEquals(testUser, result);
    }

    @Test
    void findByEmail_NotFound() {
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> userService.findByEmail("test@test.com"));
    }

    @Test
    void updatePassword_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("old", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("newEncoded");

        userService.updatePassword(1L, "old", "new");

        verify(userRepository).save(testUser);
        assertEquals("newEncoded", testUser.getPassword());
    }

    @Test
    void updatePassword_WrongOldPassword() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrong", "encodedPassword")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> userService.updatePassword(1L, "wrong", "new"));
    }
}
