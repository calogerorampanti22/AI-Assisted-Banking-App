package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.Beneficiary;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.BeneficiaryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BeneficiaryServiceTest {

    @Mock
    private BeneficiaryRepository beneficiaryRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private BeneficiaryService beneficiaryService;

    private Account testAccount;
    private Beneficiary testBeneficiary;

    @BeforeEach
    void setUp() {
        testAccount = new Account();
        testAccount.setId(1L);

        testBeneficiary = new Beneficiary("Mario", "Rossi", "IT123", testAccount);
        testBeneficiary.setId(1L);
    }

    @Test
    void getBeneficiaries() {
        when(beneficiaryRepository.findByAccountId(1L)).thenReturn(List.of(testBeneficiary));
        List<Beneficiary> result = beneficiaryService.getBeneficiaries(1L);
        assertEquals(1, result.size());
    }

    @Test
    void addBeneficiary_Success() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));
        when(beneficiaryRepository.save(any(Beneficiary.class))).thenReturn(testBeneficiary);

        Beneficiary result = beneficiaryService.addBeneficiary(1L, "Mario", "Rossi", "IT123");

        assertNotNull(result);
        verify(beneficiaryRepository).save(any(Beneficiary.class));
    }

    @Test
    void deleteBeneficiary_Success() {
        when(beneficiaryRepository.findByIdAndAccountId(1L, 1L)).thenReturn(Optional.of(testBeneficiary));
        
        beneficiaryService.deleteBeneficiary(1L, 1L);
        
        verify(beneficiaryRepository).delete(testBeneficiary);
    }
}
