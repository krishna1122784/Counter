package com.radha.counter_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "jaap_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JaapSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String jaapName;

    @Column(nullable = false)
    private Integer count;

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
