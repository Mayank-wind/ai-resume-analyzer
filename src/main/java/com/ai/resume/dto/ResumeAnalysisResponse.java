package com.ai.resume.dto;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class ResumeAnalysisResponse {

    private Long id;
    private String fileName;
    private String extractedText;
    private String jobDescription;
    private Integer score;
    private String feedback;
    private LocalDateTime createdAt;
    private String strengths;
    private String weaknesses;
    private String improvements;
    private String summary;

    public ResumeAnalysisResponse() {
    }

    public ResumeAnalysisResponse(Long id, String fileName, String extractedText,
                                  String jobDescription, Integer score,
                                  String feedback, String strengths,
                                  String weaknesses, String improvements,
                                  String summary, LocalDateTime createdAt) {
        this.id = id;
        this.fileName = fileName;
        this.extractedText = extractedText;
        this.jobDescription = jobDescription;
        this.score = score;
        this.feedback = feedback;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.improvements = improvements;
        this.summary = summary;
        this.createdAt = createdAt;
    }
}
