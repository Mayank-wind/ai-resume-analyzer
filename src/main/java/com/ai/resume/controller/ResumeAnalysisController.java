package com.ai.resume.controller;

import com.ai.resume.dto.ResumeAnalysisResponse;
import com.ai.resume.service.ResumeAnalysisService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;

    public ResumeAnalysisController(ResumeAnalysisService resumeAnalysisService) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    @PostMapping("/upload")
    public ResumeAnalysisResponse uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobDescription", required = false) String jobDescription,
            Authentication authentication
    ) {
        return resumeAnalysisService.uploadResume(file, jobDescription, authentication.getName());
    }

    @GetMapping
    public List<ResumeAnalysisResponse> getMyAnalyses(Authentication authentication) {
        return resumeAnalysisService.getMyAnalyses(authentication.getName());
    }

    @GetMapping("/{id}")
    public ResumeAnalysisResponse getAnalysisById(@PathVariable Long id, Authentication authentication) {
        return resumeAnalysisService.getAnalysisById(id, authentication.getName());
    }
}
