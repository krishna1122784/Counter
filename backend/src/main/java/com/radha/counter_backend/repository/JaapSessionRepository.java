package com.radha.counter_backend.repository;

import com.radha.counter_backend.entity.JaapSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JaapSessionRepository extends JpaRepository<JaapSession, Long> {
    List<JaapSession> findByUserIdOrderByTimestampDesc(Long userId);
}
