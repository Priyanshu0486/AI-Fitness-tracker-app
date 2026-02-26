package com.fitness.activity_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;
@Document(collection = "activities")
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class Activity {
    @Id
    private String id;
    private String userId;
    private ActivityType type;
    private Integer duration; // in minutes
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    @Field("metrics")
    private Map<String, Object> additionalMetrics; // For storing activity-specific data like distance, steps, etc.
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
