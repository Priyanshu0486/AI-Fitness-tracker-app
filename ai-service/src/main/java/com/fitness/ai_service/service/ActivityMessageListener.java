package com.fitness.ai_service.service;

import com.fitness.ai_service.model.Activity;
import com.fitness.ai_service.model.Recommendation;
import com.fitness.ai_service.repository.RecommendationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListener {
    private final ActivityAiService activityAiService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        log.info("Received activity message of activity: {}", activity.getId());
        try {
            Recommendation recommendation = activityAiService.generateRecommendation(activity);
            recommendationRepository.save(recommendation);
            log.info("Recommendation saved for activity: {}", activity.getId());
        } catch (Exception e) {
            log.error("Failed to process activity {}: {}", activity.getId(), e.getMessage());
            // Don't rethrow - prevents RabbitMQ from retrying endlessly
        }
    }
}
