# 🚀 AI Resume Analyzer (SaaS)

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

An advanced AI-powered Resume Analyzer built using **Spring Boot, JWT Authentication, and OpenAI/Gemini API**. This application analyzes resumes, scores candidates, and provides intelligent improvement suggestions.

---

## 🔥 Features
- 📄 Upload Resume (PDF)
- 🧠 AI-powered Resume Analysis
- 📊 Resume Scoring System (skills, experience, structure)
- 💡 Smart Suggestions for Improvement
- 🔐 Secure Authentication (JWT-based login/signup)
- 🗄️ Database Storage (User + Analysis Results)

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- MySQL / PostgreSQL

### AI Integration
- OpenAI API / Gemini API

### Tools & Libraries
- Apache PDFBox (PDF parsing)
- Lombok
- Maven

---

## 🏗️ Project Architecture
This project follows a layered architecture for scalability and maintainability.

ai-resume-analyzer/
│
├── controller/        # Handles HTTP requests (REST APIs)
├── service/           # Business logic layer
├── repository/        # Database interaction (JPA Repositories)
├── entity/            # Database entities (User, Resume, Analysis)
├── dto/               # Data Transfer Objects (Request/Response)
├── security/          # JWT authentication & authorization
├── config/            # Configuration classes (Security, CORS, etc.)
│
└── resources/
└── application.properties   # App configuration

Layer Responsibilities:
- Controller → Handles HTTP requests & APIs
- Service → Business logic & processing
- Repository → Database operations
- Entity → DB tables mapping
- DTO → Data transfer objects
- Security → JWT authentication
- Config → App configurations

---

## ⚙️ How It Works
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

## 🔐 Authentication Flow
- User Registration
- Login with credentials
- JWT token generation
- Secured APIs using token

---

## 🚧 Current Status
🟡 Backend Setup Completed  
🔄 Authentication in Progress  
⏳ AI Integration Pending

---

## 📈 Future Enhancements
- Frontend Dashboard (React)
- Resume Comparison Feature
- ATS Score Optimization
- Multi-file Upload
- AI Chat Assistant for Resume

---

## 🧪 API Testing
Use **Postman** or similar tools:
- `/auth/register`
- `/auth/login`
- `/resume/upload`
- `/resume/analyze`

---

## 👨‍💻 Author
**Mayank Kumar Singh**  
GitHub: https://github.com/Mayank-wind  
LinkedIn: (Add later)

---

## 🚀 Key Highlights
- Clean layered architecture
- Secure REST APIs with JWT
- AI-powered resume analysis
- Built with production-level practices

---

## ⭐ Why This Project?
- Real-world backend development
- AI integration
- Secure authentication
- Scalable system design

---

## 📌 Note
This is a **production-level SaaS project** aimed at solving real-world hiring problems using AI.

---

⭐ If you like this project, consider giving it a star!