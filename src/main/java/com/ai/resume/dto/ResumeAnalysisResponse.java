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
    private Integer matchScore;
    private String feedback;
    private String strengths;
    private String weaknesses;
    private String improvements;
    private String summary;
    private String skillsFound;
    private String missingSkills;
    private String suggestions;
    private LocalDateTime createdAt;

    public ResumeAnalysisResponse() {
    }

    public ResumeAnalysisResponse(Long id,String fileName,String extractedText,String jobDescription,
                                  Integer score,Integer matchScore,String feedback,String strengths,
                                  String weaknesses,String improvements,String summary,String skillsFound,
                                  String missingSkills,String suggestions,LocalDateTime createdAt) {
        this.id = id;
        this.fileName = fileName;
        this.extractedText = extractedText;
        this.jobDescription = jobDescription;
        this.score = score;
        this.matchScore = matchScore;
        this.feedback = feedback;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.improvements = improvements;
        this.summary = summary;
        this.skillsFound = skillsFound;
        this.missingSkills = missingSkills;
        this.suggestions = suggestions;
        this.createdAt = createdAt;
    }
}
