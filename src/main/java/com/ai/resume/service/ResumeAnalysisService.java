package com.ai.resume.service;

import com.ai.resume.dto.ResumeAnalysisResponse;
import com.ai.resume.entity.ResumeAnalysis;
import com.ai.resume.entity.User;
import com.ai.resume.repository.ResumeAnalysisRepository;
import com.ai.resume.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeAnalysisService {

    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final UserRepository userRepository;

    public ResumeAnalysisService(ResumeAnalysisRepository resumeAnalysisRepository,
                                 UserRepository userRepository) {
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.userRepository = userRepository;
    }

    public ResumeAnalysisResponse uploadResume(MultipartFile file, String jobDescription, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setFileName(file.getOriginalFilename());
        analysis.setExtractedText("PDF text extraction pending");
        analysis.setJobDescription(jobDescription);
        analysis.setScore(0);
        analysis.setFeedback("AI analysis pending");
        analysis.setUser(user);

        ResumeAnalysis saved = resumeAnalysisRepository.save(analysis);

        return new ResumeAnalysisResponse(
                saved.getId(),
                saved.getFileName(),
                saved.getExtractedText(),
                saved.getJobDescription(),
                saved.getScore(),
                saved.getFeedback(),
                saved.getCreatedAt()
        );
    }
}
