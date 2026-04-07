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

    public ResumeAnalysisResponse() {
    }

    public ResumeAnalysisResponse(Long id, String fileName, String extractedText,
                                  String jobDescription, Integer score,
                                  String feedback, LocalDateTime createdAt) {
        this.id = id;
        this.fileName = fileName;
        this.extractedText = extractedText;
        this.jobDescription = jobDescription;
        this.score = score;
        this.feedback = feedback;
        this.createdAt = createdAt;
    }
}
