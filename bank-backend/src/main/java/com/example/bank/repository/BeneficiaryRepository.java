package com.example.bank.repository;

import com.example.bank.model.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByAccountId(Long accountId);

    Optional<Beneficiary> findByIdAndAccountId(Long id, Long accountId);
}
