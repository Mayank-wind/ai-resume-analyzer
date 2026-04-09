package com.ai.resume.repository;

import com.ai.resume.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<ResumeAnalysis> findByIdAndUserId(Long id, Long userId);
}
