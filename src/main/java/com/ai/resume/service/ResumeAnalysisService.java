package com.ai.resume.service;

import com.ai.resume.dto.ResumeAnalysisResponse;
import com.ai.resume.entity.ResumeAnalysis;
import com.ai.resume.entity.User;
import com.ai.resume.repository.ResumeAnalysisRepository;
import com.ai.resume.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ResumeAnalysisService {

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;
    private final PdfService pdfService;
    private final GeminiService geminiService;

    public ResumeAnalysisService(ResumeAnalysisRepository resumeAnalysisRepository,
                                 UserRepository userRepository,
                                 PdfService pdfService,
                                 GeminiService geminiService) {
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.userRepository = userRepository;
        this.pdfService = pdfService;
        this.geminiService = geminiService;
    }

    public ResumeAnalysisResponse uploadResume(MultipartFile file, String jobDescription, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String extractedText = pdfService.extractText(file);

        String feedback;
        int matchScore;
        String skillsFound;
        String missingSkills;
        String suggestions;
        String summary;

        try {
            feedback = geminiService.analyzeResume(extractedText, jobDescription);
            matchScore = geminiService.extractMatchScore(feedback);
            skillsFound = geminiService.extractSection(feedback, "Skills Found", "Missing Skills", "Suggestions", "Summary");
            missingSkills = geminiService.extractSection(feedback, "Missing Skills", "Suggestions", "Summary");
            suggestions = geminiService.extractSection(feedback, "Suggestions", "Summary");
            summary = geminiService.extractSection(feedback, "Summary");
        } catch (Exception e) {
            feedback = "AI analysis is temporarily unavailable";
            matchScore = 0;
            skillsFound = "";
            missingSkills = "";
            suggestions = "";
            summary = "";
        }

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setFileName(file.getOriginalFilename());
        analysis.setExtractedText(extractedText);
        analysis.setJobDescription(jobDescription);
        analysis.setScore(matchScore);
        analysis.setFeedback(feedback);
        analysis.setSummary(summary);
        analysis.setSkillsFound(skillsFound);
        analysis.setMissingSkills(missingSkills);
        analysis.setSuggestions(suggestions);
        analysis.setUser(user);

        ResumeAnalysis saved = resumeAnalysisRepository.save(analysis);

        return mapToResponse(saved);
    }

    public List<ResumeAnalysisResponse> getMyAnalyses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return resumeAnalysisRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ResumeAnalysisResponse getAnalysisById(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ResumeAnalysis analysis = resumeAnalysisRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Analysis not found"));

        return mapToResponse(analysis);
    }

    private ResumeAnalysisResponse mapToResponse(ResumeAnalysis analysis) {
        return new ResumeAnalysisResponse(
                analysis.getId(),
                analysis.getFileName(),
                analysis.getExtractedText(),
                analysis.getJobDescription(),
                analysis.getScore(),
                analysis.getScore(),
                analysis.getFeedback(),
                analysis.getStrengths(),
                analysis.getWeaknesses(),
                analysis.getImprovements(),
                analysis.getSummary(),
                analysis.getSkillsFound(),
                analysis.getMissingSkills(),
                analysis.getSuggestions(),
                analysis.getCreatedAt()
        );
    }
}
