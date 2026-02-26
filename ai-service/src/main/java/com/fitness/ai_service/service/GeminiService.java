package com.fitness.ai_service.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GeminiService {
    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiapiurl;
    @Value("${gemini.api.key}")
    private String geminiapikey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {
        Map<String, Object> requestBody = Map.of("contents", new Object[] {
                Map.of("parts", new Object[] {
                        Map.of("text", question)
                })
        });
        try {
            String response = webClient.post()
                    .uri(geminiapiurl + geminiapikey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            return response;
        } catch (WebClientResponseException.TooManyRequests e) {
            log.warn("Gemini API rate limit exceeded (429). Will use default recommendation. Retry after some time.");
            return null;
        } catch (WebClientResponseException e) {
            log.error("Gemini API error - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.error("Unexpected error calling Gemini API: {}", e.getMessage());
            return null;
        }
    }

}
