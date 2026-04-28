package com.example.bank.dto;

import com.example.bank.model.CardNetwork;
import com.example.bank.model.CardType;
import com.example.bank.model.TransactionCategory;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class DtoTest {

    @Test
    void testBeneficiaryRequest() {
        BeneficiaryRequest dto = new BeneficiaryRequest();
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setIban("IT123");
        
        assertEquals("John", dto.getFirstName());
        assertEquals("Doe", dto.getLastName());
        assertEquals("IT123", dto.getIban());
    }

    @Test
    void testCardRequest() {
        CardRequest dto = new CardRequest();
        dto.setType(CardType.DEBIT);
        dto.setNetwork(CardNetwork.VISA);
        
        assertEquals(CardType.DEBIT, dto.getType());
        assertEquals(CardNetwork.VISA, dto.getNetwork());
    }

    @Test
    void testJwtResponse() {
        JwtResponse dto = new JwtResponse("token", 1L, "user", "ROLE_USER");
        dto.setType("Bearer");
        
        assertEquals("token", dto.getToken());
        assertEquals(1L, dto.getId());
        assertEquals("user", dto.getUsername());
        assertEquals("ROLE_USER", dto.getRole());
        assertEquals("Bearer", dto.getType());
        
        dto.setToken("new");
        dto.setId(2L);
        dto.setUsername("newuser");
        dto.setRole("ADMIN");
        dto.setType("Basic");
        
        assertEquals("new", dto.getToken());
        assertEquals(2L, dto.getId());
        assertEquals("newuser", dto.getUsername());
        assertEquals("ADMIN", dto.getRole());
        assertEquals("Basic", dto.getType());
    }

    @Test
    void testLoginRequest() {
        LoginRequest dto = new LoginRequest();
        dto.setEmail("user@test.com");
        dto.setPassword("pass");
        
        assertEquals("user@test.com", dto.getEmail());
        assertEquals("pass", dto.getPassword());
    }

    @Test
    void testPasswordUpdateDto() {
        PasswordUpdateDto dto = new PasswordUpdateDto();
        dto.setOldPassword("old");
        dto.setNewPassword("new");
        
        assertEquals("old", dto.getOldPassword());
        assertEquals("new", dto.getNewPassword());
    }

    @Test
    void testSavingsGoalRequest() {
        SavingsGoalRequest dto = new SavingsGoalRequest();
        dto.setName("car");
        dto.setTargetAmount(BigDecimal.TEN);
        dto.setAmount(BigDecimal.ONE);
        
        assertEquals("car", dto.getName());
        assertEquals(BigDecimal.TEN, dto.getTargetAmount());
        assertEquals(BigDecimal.ONE, dto.getAmount());
    }

    @Test
    void testBillPaymentRequest() {
        BillPaymentRequest dto = new BillPaymentRequest();
        dto.setAmount(BigDecimal.valueOf(100));
        dto.setBillerName("Enel");
        dto.setBillReferenceNumber("REF123");
        dto.setDescription("Light bill");
        dto.setType(TransactionCategory.BOLLETTINO);
        
        assertEquals(BigDecimal.valueOf(100), dto.getAmount());
        assertEquals("Enel", dto.getBillerName());
        assertEquals("REF123", dto.getBillReferenceNumber());
        assertEquals("Light bill", dto.getDescription());
        assertEquals(TransactionCategory.BOLLETTINO, dto.getCategory());
    }
}
