package com.ai.resume.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private Integer score;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @Lob
    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String improvements;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary;

}
