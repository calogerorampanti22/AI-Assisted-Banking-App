package com.example.bank.repository;

import com.example.bank.model.PhoneContact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhoneContactRepository extends JpaRepository<PhoneContact, Long> {
    List<PhoneContact> findByUserId(Long userId);
}
