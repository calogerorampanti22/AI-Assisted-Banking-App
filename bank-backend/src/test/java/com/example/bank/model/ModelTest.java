package com.example.bank.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ModelTest {

    @Test
    void testUserPOJO() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPassword("pass");
        user.setRole(Role.USER);
        user.setNationality("Italian");
        user.setBirthday(LocalDate.now());
        user.setBirthPlace("Rome");
        user.setIdCardNumber("A123");
        user.setTaxId("TX123");
        Account account = new Account();
        user.setAccount(account);

        assertEquals(1L, user.getId());
        assertEquals("test@test.com", user.getEmail());
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals("pass", user.getPassword());
        assertEquals(Role.USER, user.getRole());
        assertEquals("Italian", user.getNationality());
        assertNotNull(user.getBirthday());
        assertEquals("Rome", user.getBirthPlace());
        assertEquals("A123", user.getIdCardNumber());
        assertEquals("TX123", user.getTaxId());
        assertEquals(account, user.getAccount());
        assertEquals("test@test.com", user.getUsername());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
        assertFalse(user.getAuthorities().isEmpty());
    }

    @Test
    void testAccountPOJO() {
        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("IT123");
        account.setBalance(BigDecimal.TEN);
        User user = new User();
        account.setUser(user);

        assertEquals(1L, account.getId());
        assertEquals("IT123", account.getAccountNumber());
        assertEquals(BigDecimal.TEN, account.getBalance());
        assertEquals(user, account.getUser());
    }

    @Test
    void testTransactionPOJO() {
        Transaction t = new Transaction();
        t.setId(1L);
        t.setAmount(BigDecimal.ONE);
        t.setCategory(TransactionCategory.BONIFICO);
        t.setDate(LocalDateTime.now());
        t.setDescription("Desc");
        t.setType(TransactionType.OUT);

        assertEquals(1L, t.getId());
        assertEquals(BigDecimal.ONE, t.getAmount());
        assertEquals(TransactionCategory.BONIFICO, t.getCategory());
        assertNotNull(t.getDate());
        assertEquals("Desc", t.getDescription());
        assertEquals(TransactionType.OUT, t.getType());
    }
}
