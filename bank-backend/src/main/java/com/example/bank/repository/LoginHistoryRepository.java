package com.example.bank.repository;

import com.example.bank.model.LoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    List<LoginHistory> findByUserIdOrderByLoginDateDesc(Long userId);
}
