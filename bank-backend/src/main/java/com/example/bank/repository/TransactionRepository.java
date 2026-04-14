package com.example.bank.repository;

import com.example.bank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountIdOrderByDateDesc(Long accountId);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId AND (:startDate IS NULL OR t.date >= :startDate) AND (:endDate IS NULL OR t.date <= :endDate) AND (:type IS NULL OR t.type = :type) ORDER BY t.date DESC")
    List<Transaction> findFilteredTransactions(@Param("accountId") Long accountId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("type") com.example.bank.model.TransactionType type);
}
