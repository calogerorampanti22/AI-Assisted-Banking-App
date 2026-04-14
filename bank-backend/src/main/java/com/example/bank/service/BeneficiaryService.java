package com.example.bank.service;

import com.example.bank.model.Account;
import com.example.bank.model.Beneficiary;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.BeneficiaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;

    public BeneficiaryService(BeneficiaryRepository beneficiaryRepository, AccountRepository accountRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
        this.accountRepository = accountRepository;
    }

    public List<Beneficiary> getBeneficiaries(Long accountId) {
        return beneficiaryRepository.findByAccountId(accountId);
    }

    public Beneficiary addBeneficiary(Long accountId, String firstName, String lastName, String iban) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account non trovato"));
        Beneficiary beneficiary = new Beneficiary(firstName, lastName, iban, account);
        return beneficiaryRepository.save(beneficiary);
    }

    public void deleteBeneficiary(Long id, Long accountId) {
        Beneficiary beneficiary = beneficiaryRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new RuntimeException("Beneficiario non trovato o non autorizzato"));
        beneficiaryRepository.delete(beneficiary);
    }
}
