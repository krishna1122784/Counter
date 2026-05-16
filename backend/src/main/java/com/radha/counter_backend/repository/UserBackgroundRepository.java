package com.radha.counter_backend.repository;

import com.radha.counter_backend.entity.UserBackground;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserBackgroundRepository extends JpaRepository<UserBackground, Long> {
    List<UserBackground> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
