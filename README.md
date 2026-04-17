# AI Resume Analyzer (SaaS)

![Java](https://img.shields.io/badge/Java-25-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-4.x-brightgreen)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

An advanced AI-powered Resume Analyzer built using **Spring Boot, JWT Authentication, PostgreSQL-ready configuration, and Gemini API**. This application allows users to upload PDF resumes, analyze them with AI, score candidates, and review previous analysis history through a browser-based interface.

---

## Features
- Upload Resume in PDF format
- Extract PDF text using Apache PDFBox
- AI-powered resume analysis using Gemini
- AI-generated candidate score
- Structured analysis output:
    - strengths
    - weaknesses
    - improvements
    - summary
- Secure JWT-based authentication
- Resume analysis history per user
- Frontend built with HTML, CSS, and JavaScript
- PostgreSQL-ready backend configuration
- Clean global exception handling

---

## Tech Stack

### Backend
- Java 25
- Spring Boot 4
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- H2 (fallback for local/dev)

### AI Integration
- Gemini API

### Frontend
- HTML
- CSS
- JavaScript

### Tools & Libraries
- Apache PDFBox
- Lombok
- Maven

---

## Project Architecture
This project follows a layered architecture for scalability and maintainability.

```text
ai-resume-analyzer/
?
??? controller/        # REST API controllers
??? service/           # Business logic and AI integration
??? repository/        # JPA repositories
??? entity/            # Database entities
??? dto/               # Request/response objects
??? security/          # JWT auth and filters
??? config/            # Security and global exception config
?
??? resources/
    ??? static/        # Frontend files
    ??? application.properties


Layer Responsibilities:
- Controller ? Handles HTTP requests & APIs
- Service ? Business logic & processing
- Repository ? Database operations
- Entity ? DB tables mapping
- DTO ? Data transfer objects
- Security ? JWT authentication
- Config ? App configurations
```
---
'/'
## ?? How It Works
1. User registers and logs in
2. Uploads resume (PDF)
3. Backend extracts text using PDFBox
4. Resume text is sent to AI (OpenAI/Gemini)
5. AI returns:
    - Score
    - Strengths
    - Weaknesses
    - Suggestions
6. Data is stored in database
7. User can view results anytime

---

## ? Authentication Flow
- User Registration
- Login with credentials
- JWT token generation
- Secured APIs using token

---

## ? Current Status
? Backend Setup Completed  
? Authentication in Progress  
? AI Integration Pending

---

## ? Future Enhancements
- Frontend Dashboard (React)
- Resume Comparison Feature
- ATS Score Optimization
- Multi-file Upload
- AI Chat Assistant for Resume

---

## ? API Testing
Use **Postman** or similar tools:
- `/auth/register`
- `/auth/login`
- `/resume/upload`
- `/resume/analyze`

---

## ??? Author
**Mayank Kumar Singh**  
GitHub: https://github.com/Mayank-wind  
LinkedIn: (Add later)

---

## ? Key Highlights
- Clean layered architecture
- Secure REST APIs with JWT
- AI-powered resume analysis
- Built with production-level practices

---

## ? Why This Project?
- Real-world backend development
- AI integration
- Secure authentication
- Scalable system design

---

## ? Note
This is a **production-level SaaS project** aimed at solving real-world hiring problems using AI.

---

? If you like this project, consider giving it a star!