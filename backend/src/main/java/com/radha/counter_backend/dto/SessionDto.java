package com.radha.counter_backend.dto;
import lombok.Data;
@Data
public class SessionDto {
    private Long userId;
    private String jaapName;
    private Integer count;
}
