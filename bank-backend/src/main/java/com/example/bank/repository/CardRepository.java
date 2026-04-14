package com.example.bank.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bank.model.Card;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByAccountId(Long accountId);
}
