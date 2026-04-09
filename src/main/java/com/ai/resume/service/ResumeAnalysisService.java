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
        int score;
        String strengths;
        String weaknesses;
        String improvements;
        String summary;

        try {
            feedback = geminiService.analyzeResume(extractedText, jobDescription);
            score = geminiService.extractScore(feedback);
            strengths = geminiService.extractSection(feedback, "Strengths", "Weaknesses", "Improvements", "Summary");
            weaknesses = geminiService.extractSection(feedback, "Weaknesses", "Improvements", "Summary");
            improvements = geminiService.extractSection(feedback, "Improvements", "Summary");
            summary = geminiService.extractSection(feedback, "Summary");
        } catch (Exception e) {
            feedback = "AI analysis is temporarily unavailable";
            score = 0;
            strengths = "";
            weaknesses = "";
            improvements = "";
            summary = "";
        }


        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setFileName(file.getOriginalFilename());
        analysis.setExtractedText(extractedText);
        analysis.setJobDescription(jobDescription);
        analysis.setScore(score);
        analysis.setFeedback(feedback);
        analysis.setStrengths(strengths);
        analysis.setWeaknesses(weaknesses);
        analysis.setImprovements(improvements);
        analysis.setSummary(summary);
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
                analysis.getFeedback(),
                analysis.getStrengths(),
                analysis.getWeaknesses(),
                analysis.getImprovements(),
                analysis.getSummary(),
                analysis.getCreatedAt()
        );
    }
}
