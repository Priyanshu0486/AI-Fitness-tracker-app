package com.fitness.ai_service.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class Activity {
    private String id;
    private String userId;
    private String type;
    private Integer duration; // in minutes
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics; // For storing activity-specific data like distance, steps, etc.
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
