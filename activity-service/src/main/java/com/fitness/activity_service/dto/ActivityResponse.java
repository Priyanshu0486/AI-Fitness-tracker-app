package com.fitness.activity_service.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fitness.activity_service.model.ActivityType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@JsonPropertyOrder({
        "id",
        "userId",
        "type",
        "duration",
        "caloriesBurned",
        "startTime",
        "additionalMetrics",
        "createdAt",
        "updatedAt"
})
public class ActivityResponse {
    private String id;
    private String userId;
    private ActivityType type;
    private Integer duration; // in minutes
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics; // For storing activity-specific data like distance, steps, etc.
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
