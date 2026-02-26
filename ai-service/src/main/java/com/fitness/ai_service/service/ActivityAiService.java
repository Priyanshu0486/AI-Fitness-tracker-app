package com.fitness.ai_service.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fitness.ai_service.model.Activity;
import com.fitness.ai_service.model.Recommendation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAiService {
  private final GeminiService geminiService;

  public Recommendation generateRecommendation(Activity activity) {
    String prompt = createPromptForAi(activity);
    String aiResponse = geminiService.getAnswer(prompt);
    if (aiResponse == null) {
      log.warn("AI response was null for activity: {}. Using default recommendation.", activity.getId());
      return genrateDefaultRecommendatio(activity);
    }
    log.info("AI Response: {}", aiResponse);
    return processAiResponse(activity, aiResponse);
  }

  private Recommendation processAiResponse(Activity activity, String aiResponse) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      JsonNode rootNode = objectMapper.readTree(aiResponse);
      JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
      String jsonContent = textNode.asText().replaceAll("```json\\n", "").replaceAll("\\n```", "").trim();
      // log.info("Parsed content from ai: {}", jsonContent);
      JsonNode analysisJson = objectMapper.readTree(jsonContent);
      JsonNode analysisNode = analysisJson.path("analysis");
      StringBuilder fullAnalysis = new StringBuilder();
      addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
      addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
      addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
      addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories Burned:");

      List<String> improvements = extractImprovements(analysisJson.path("improvements"));
      List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
      List<String> safety = extractSafety(analysisJson.path("safety"));

      return Recommendation.builder()
          .activityId(activity.getId())
          .userId(activity.getUserId())
          .activityType(activity.getType())
          .recommendation(fullAnalysis.toString().trim())
          .improvement(improvements)
          .suggestions(suggestions)
          .safety(safety)
          .build();

    } catch (Exception e) {
      // TODO: handle exception
      e.printStackTrace();
      return genrateDefaultRecommendatio(activity);
    }

  }

  private Recommendation genrateDefaultRecommendatio(Activity activity) {
    return Recommendation.builder()
        .activityId(activity.getId())
        .userId(activity.getUserId())
        .activityType(activity.getType())
        .recommendation(
            "Unable to generate AI analysis. Please consult a fitness professional for personalized advice.")
        .improvement(Collections.singletonList("No specific improvements available at this time."))
        .suggestions(Collections.singletonList("Continue with your regular workout routine."))
        .safety(Collections.singletonList("Follow general safety guidelines for your activity."))
        .build();
  }

  private List<String> extractSafety(JsonNode safetyNode) {
    List<String> safety = new ArrayList<>();
    if (safetyNode.isArray()) {
      safetyNode.forEach(item -> {
        safety.add(item.asText());
      });
    }
    return safety.isEmpty() ? Collections.singletonList("Follow general safety guidelines") : safety;
  }

  private List<String> extractSuggestions(JsonNode suggestionNode) {
    List<String> suggestions = new ArrayList<>();
    if (suggestionNode.isArray()) {
      suggestionNode.forEach(suggestion -> {
        String workout = suggestion.path("workout").asText();
        String description = suggestion.path("description").asText();
        suggestions.add(String.format("%s: %s", workout, description));
      });
    }
    return suggestions.isEmpty() ? Collections.singletonList("No specific suggestions needed.") : suggestions;
  }

  private List<String> extractImprovements(JsonNode improvementNode) {
    List<String> improvements = new ArrayList<>();
    if (improvementNode.isArray()) {
      improvementNode.forEach(improvement -> {
        String area = improvement.path("area").asText();
        String detail = improvement.path("recommendation").asText();
        improvements.add(String.format("%s: %s", area, detail));
      });
    }
    return improvements.isEmpty() ? Collections.singletonList("No specific improvements needed.") : improvements;
  }

  private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
    if (!analysisNode.path(key).isMissingNode()) {
      fullAnalysis.append(prefix).append(analysisNode.path(key).asText()).append("\n\n");

    }

  }

  private String createPromptForAi(Activity activity) {
    return String.format(
        """
            Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
            {
              "analysis": {
                "overall": "Overall analysis here",
                "pace": "Pace analysis here",
                "heartRate": "Heart rate analysis here",
                "caloriesBurned": "Calories analysis here"
              },
              "improvements": [
                {
                  "area": "Area name",
                  "recommendation": "Detailed recommendation"
                }
              ],
              "suggestions": [
                {
                  "workout": "Workout name",
                  "description": "Detailed workout description"
                }
              ],
              "safety": [
                "Safety point 1",
                "Safety point 2"
              ]
            }

            Analyze this activity:
            Activity Type: %s
            Duration: %d minutes
            Calories Burned: %d
            Additional Metrics: %s

            Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
            Ensure the response follows the EXACT JSON format shown above.
            """,
        activity.getType(),
        activity.getDuration(),
        activity.getCaloriesBurned(),
        activity.getAdditionalMetrics());
  }
}
