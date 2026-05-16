package com.radha.counter_backend.controller;

import com.radha.counter_backend.entity.JaapSession;
import com.radha.counter_backend.entity.User;
import com.radha.counter_backend.repository.JaapSessionRepository;
import com.radha.counter_backend.repository.UserRepository;
import com.radha.counter_backend.dto.SessionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired
    private JaapSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> saveSession(@RequestBody SessionDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found");

        JaapSession session = new JaapSession();
        session.setUser(user);
        session.setJaapName(dto.getJaapName());
        session.setCount(dto.getCount());
        session.setTimestamp(LocalDateTime.now());
        
        sessionRepository.save(session);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<JaapSession>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionRepository.findByUserIdOrderByTimestampDesc(userId));
    }
}
