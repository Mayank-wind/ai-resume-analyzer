package com.ai.resume.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final JsonMapper objectMapper = new JsonMapper();

    public String analyzeResume(String resumeText, String jobDescription) {
        try {
            String prompt = buildPrompt(resumeText, jobDescription);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", prompt)
                                    )
                            )
                    )
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    geminiApiUrl,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());

            return root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text")
                    .asText("No AI feedback generated");
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze resume with Gemini", e);
        }
    }

    private String buildPrompt(String resumeText, String jobDescription) {
        return """
            Analyze the following resume for a job candidate.

            Return:
            1. A candidate score out of 100 at the very beginning in this format:
               Score: <number>
            2. Overall strengths
            3. Weaknesses
            4. Suggested improvements
            5. Skill gaps compared to the job description
            6. A short recruiter-style summary

            Job Description:
            %s

            Resume Text:
            %s
            """.formatted(
                jobDescription != null ? jobDescription : "No job description provided",
                resumeText
        );
    }

    public int extractScore(String feedback) {
        try {
            String[] lines = feedback.split("\\R");
            for (String line : lines) {
                line = line.trim();
                if (line.toLowerCase().startsWith("score:")) {
                    String value = line.substring(6).trim();
                    return Integer.parseInt(value.replaceAll("[^0-9]", ""));
                }
            }
        } catch (Exception ignored) {
        }
        return 0;
    }
}
