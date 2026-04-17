const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "http://43.205.99.107:8081";

const healthBtn = document.getElementById("healthBtn");
const healthResult = document.getElementById("healthResult");

const registerForm = document.getElementById("registerForm");
const registerResult = document.getElementById("registerResult");
const registerBtn = document.getElementById("registerBtn");

const loginForm = document.getElementById("loginForm");
const loginResult = document.getElementById("loginResult");
const loginBtn = document.getElementById("loginBtn");

const logoutBtn = document.getElementById("logoutBtn");
const userWelcome = document.getElementById("userWelcome");

const uploadForm = document.getElementById("uploadForm");
const uploadResult = document.getElementById("uploadResult");
const uploadBtn = document.getElementById("uploadBtn");
const analysisResult = document.getElementById("analysisResult");

const loadHistoryBtn = document.getElementById("loadHistoryBtn");
const historyList = document.getElementById("historyList");
const historySearch = document.getElementById("historySearch");

const globalMessage = document.getElementById("globalMessage");
const downloadReportBtn = document.getElementById("downloadReportBtn");

const totalAnalyses = document.getElementById("totalAnalyses");
const averageScore = document.getElementById("averageScore");
const latestResume = document.getElementById("latestResume");

const introSection = document.getElementById("introSection");
const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");
const analysisSection = document.getElementById("analysisSection");
const emptyStateCard = document.getElementById("emptyStateCard");
const loadingCard = document.getElementById("loadingCard");

let allHistoryItems = [];
let currentAnalysis = null;
let messageTimeout = null;

function splitCommaValues(text) {
    if (!text || !text.trim()) {
        return [];
    }

    return text
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);
}

async function safeJson(response) {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        return null;
    }

    try {
        return await response.json();
    } catch (error) {
        return null;
    }
}

function showGlobalMessage(message, type = "success") {
    if (!globalMessage) {
        return;
    }

    globalMessage.textContent = message;
    globalMessage.className = `global-message ${type}`;

    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }

    messageTimeout = setTimeout(() => {
        globalMessage.className = "global-message hidden";
        globalMessage.textContent = "";
    }, 3000);
}

function setButtonLoading(button, loadingText, originalText, isLoading) {
    if (!button) {
        return;
    }

    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : originalText;
}

function setAnalysisLoading(isLoading) {
    if (!loadingCard || !analysisSection || !emptyStateCard) {
        return;
    }

    if (isLoading) {
        loadingCard.classList.remove("hidden");
        analysisSection.classList.add("hidden");
        emptyStateCard.classList.add("hidden");
    } else {
        loadingCard.classList.add("hidden");
    }
}

function resetAnalysisView() {
    currentAnalysis = null;

    if (analysisSection) {
        analysisSection.classList.add("hidden");
    }

    if (loadingCard) {
        loadingCard.classList.add("hidden");
    }

    if (emptyStateCard) {
        emptyStateCard.classList.remove("hidden");
    }

    if (analysisResult) {
        analysisResult.innerHTML = "<p>No analysis yet.</p>";
    }
}

function updateAppState() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (token) {
        introSection?.classList.add("hidden");
        authSection?.classList.add("hidden");
        dashboardSection?.classList.remove("hidden");
        logoutBtn?.classList.remove("hidden");
        userWelcome?.classList.remove("hidden");

        if (userWelcome) {
            userWelcome.textContent = email ? `Welcome, ${email}` : "Welcome";
        }
    } else {
        introSection?.classList.remove("hidden");
        authSection?.classList.remove("hidden");
        dashboardSection?.classList.add("hidden");
        logoutBtn?.classList.add("hidden");
        userWelcome?.classList.add("hidden");

        if (userWelcome) {
            userWelcome.textContent = "";
        }

        resetAnalysisView();
        allHistoryItems = [];

        if (historyList) {
            historyList.innerHTML = "<p>No history loaded yet.</p>";
        }

        if (historySearch) {
            historySearch.value = "";
        }

        updateDashboardStats([]);
    }
}

function renderPills(items) {
    if (!items.length) {
        return `<p class="empty-inline">No data available</p>`;
    }

    return `
        <div class="pill-list">
            ${items.map(item => `<span class="pill">${item}</span>`).join("")}
        </div>
    `;
}

function renderAnalysis(data) {
    currentAnalysis = data;

    const score = data.matchScore ?? data.score ?? 0;
    const skillsFound = splitCommaValues(data.skillsFound);
    const missingSkills = splitCommaValues(data.missingSkills);

    if (analysisSection) {
        analysisSection.classList.remove("hidden");
    }

    if (emptyStateCard) {
        emptyStateCard.classList.add("hidden");
    }

    if (!analysisResult) {
        return;
    }

    analysisResult.innerHTML = `
        <div class="dashboard-result-grid">
            <div class="dashboard-result-card dashboard-score-card">
                <h3>Resume Match Score</h3>
                <p class="dashboard-score-value">${score}/100</p>
            </div>

            <div class="dashboard-result-card">
                <h3>Resume File</h3>
                <p>${data.fileName || "-"}</p>
            </div>

            <div class="dashboard-result-card">
                <h3>Created At</h3>
                <p>${data.createdAt || "-"}</p>
            </div>
        </div>

        <h3 class="dashboard-section-title">Skills Found</h3>
        <div class="dashboard-result-card">
            ${renderPills(skillsFound)}
        </div>

        <h3 class="dashboard-section-title">Missing Skills</h3>
        <div class="dashboard-result-card">
            ${renderPills(missingSkills)}
        </div>

        <h3 class="dashboard-section-title">Suggestions</h3>
        <div class="dashboard-result-card">
            <p>${data.suggestions || data.improvements || "-"}</p>
        </div>

        <h3 class="dashboard-section-title">Summary</h3>
        <div class="summary-card">
            <p>${data.summary || "-"}</p>
        </div>

        <h3 class="dashboard-section-title">Full Feedback</h3>
        <div class="dashboard-result-card">
            <p>${data.feedback || "-"}</p>
        </div>
    `;
}
function updateDashboardStats(items) {
    if (totalAnalyses) {
        totalAnalyses.textContent = items.length;
    }

    if (!items.length) {
        if (averageScore) {
            averageScore.textContent = "0";
        }

        if (latestResume) {
            latestResume.textContent = "No data";
        }

        return;
    }

    const total = items.reduce((sum, item) => sum + (item.matchScore ?? item.score ?? 0), 0);

    if (averageScore) {
        averageScore.textContent = Math.round(total / items.length);
    }

    if (latestResume) {
        latestResume.textContent = items[0].fileName || "Unknown";
    }
}

function renderHistory(items) {
    if (!historyList) {
        return;
    }

    if (!items.length) {
        historyList.innerHTML = "<p>No analyses found.</p>";
        return;
    }

    historyList.innerHTML = items.map(item => `
        <div class="history-item" data-id="${item.id}">
            <h3>${item.fileName || "Untitled Resume"}</h3>
            <p><strong>Match:</strong> ${item.matchScore ?? item.score ?? 0}/100</p>
            <p><strong>Created:</strong> ${item.createdAt || "-"}</p>
            <p><strong>Summary:</strong> ${item.summary || "No summary available"}</p>
        </div>
    `).join("");

    document.querySelectorAll(".history-item").forEach(card => {
        card.addEventListener("click", async () => {
            const id = card.getAttribute("data-id");
            await loadSingleAnalysis(id);
        });
    });
}

async function loadSingleAnalysis(id) {
    const token = localStorage.getItem("token");

    if (!token) {
        showGlobalMessage("Please login first.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/resumes/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await safeJson(response);

        if (!response.ok) {
            showGlobalMessage(data?.message || "Failed to load analysis.", "error");
            return;
        }

        if (!data) {
            showGlobalMessage("Invalid analysis response received.", "error");
            return;
        }

        renderAnalysis(data);
        showGlobalMessage("Analysis loaded successfully.");
    } catch (error) {
        showGlobalMessage("Failed to load selected analysis.", "error");
    }
}

function downloadAnalysisReport() {
    if (!currentAnalysis) {
        showGlobalMessage("No analysis available to download.", "error");
        return;
    }

    const reportContent = `
AI Resume Analyzer Report
=========================

File Name: ${currentAnalysis.fileName || "-"}
Match Score: ${currentAnalysis.matchScore ?? currentAnalysis.score ?? 0}
Created At: ${currentAnalysis.createdAt || "-"}

Skills Found:
${currentAnalysis.skillsFound || "-"}

Missing Skills:
${currentAnalysis.missingSkills || "-"}

Suggestions:
${currentAnalysis.suggestions || currentAnalysis.improvements || "-"}

Summary:
${currentAnalysis.summary || "-"}

Full Feedback:
${currentAnalysis.feedback || "-"}
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${(currentAnalysis.fileName || "analysis-report").replace(".pdf", "")}-report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showGlobalMessage("Analysis report downloaded successfully.");
}

if (healthBtn) {
    healthBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`${API_BASE}/api/health`);
            const data = await safeJson(response);

            if (healthResult) {
                if (data) {
                    healthResult.textContent = `${data.status} - ${data.service}`;
                } else {
                    healthResult.textContent = "Backend responded";
                }
            }

            showGlobalMessage("Backend is reachable.");
        } catch (error) {
            if (healthResult) {
                healthResult.textContent = "Backend connection failed";
            }

            showGlobalMessage("Backend connection failed.", "error");
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        setButtonLoading(registerBtn, "Registering...", "Register", true);

        const payload = {
            fullName: document.getElementById("registerName")?.value || "",
            email: document.getElementById("registerEmail")?.value || "",
            password: document.getElementById("registerPassword")?.value || ""
        };

        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await safeJson(response);

            if (!response.ok) {
                registerResult.textContent = data?.message || "Registration failed";
                showGlobalMessage(registerResult.textContent, "error");
                return;
            }

            if (!data) {
                registerResult.textContent = "Invalid registration response";
                showGlobalMessage(registerResult.textContent, "error");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", data.email);

            registerResult.textContent = `Registered: ${data.email}`;
            loginResult.textContent = "";
            showGlobalMessage("Registration successful.");
            updateAppState();
        } catch (error) {
            registerResult.textContent = "Registration failed";
            showGlobalMessage("Registration failed.", "error");
        } finally {
            setButtonLoading(registerBtn, "Registering...", "Register", false);
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        setButtonLoading(loginBtn, "Logging in...", "Login", true);
        const payload = {
            email: document.getElementById("loginEmail")?.value || "",
            password: document.getElementById("loginPassword")?.value || ""
        };
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await safeJson(response);
            if (!response.ok) {
                loginResult.textContent = data?.message || "Login failed";
                showGlobalMessage(loginResult.textContent, "error");
                return;
            }
            if (!data) {
                loginResult.textContent = "Invalid login response";
                showGlobalMessage(loginResult.textContent, "error");
                return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", data.email);
            loginResult.textContent = `Logged in as ${data.email}`;
            registerResult.textContent = "";
            showGlobalMessage("Login successful.");
            updateAppState();
        } catch (error) {
            loginResult.textContent = "Login failed";
            showGlobalMessage("Login failed.", "error");
        } finally {
            setButtonLoading(loginBtn, "Logging in...", "Login", false);
        }
    });
}
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        if (loginResult) {
            loginResult.textContent = "Logged out";
        }
        if (registerResult) {
            registerResult.textContent = "";
        }
        if (uploadResult) {
            uploadResult.textContent = "";
        }
        updateAppState();
        showGlobalMessage("Logged out successfully.");
    });
}
if (uploadForm) {
    uploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            uploadResult.textContent = "Please login first.";
            showGlobalMessage("Please login first.", "error");
            return;
        }
        const fileInput = document.getElementById("resumeFile");
        const jobDescription = document.getElementById("jobDescription")?.value || "";
        if (!fileInput?.files?.length) {
            uploadResult.textContent = "Please choose a PDF file.";
            showGlobalMessage("Please choose a PDF file.", "error");
            return;
        }
        setButtonLoading(uploadBtn, "Analyzing...", "Analyze Resume", true);
        setAnalysisLoading(true);
        const formData = new FormData();
        formData.append("file", fileInput.files[0]);
        formData.append("jobDescription", jobDescription);
        try {
            const response = await fetch(`${API_BASE}/api/resumes/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const data = await safeJson(response);
            if (!response.ok) {
                uploadResult.textContent = data?.message || "Upload failed";
                showGlobalMessage(uploadResult.textContent, "error");
                setAnalysisLoading(false);
                resetAnalysisView();
                return;
            }
            if (!data) {
                uploadResult.textContent = "Invalid analysis response";
                showGlobalMessage(uploadResult.textContent, "error");
                setAnalysisLoading(false);
                resetAnalysisView();
                return;
            }
            uploadResult.textContent = "Resume uploaded and analyzed successfully.";
            setAnalysisLoading(false);
            renderAnalysis(data);
            showGlobalMessage("Resume analyzed successfully.");
        } catch (error) {
            uploadResult.textContent = "Upload failed.";
            setAnalysisLoading(false);
            resetAnalysisView();
            showGlobalMessage("Upload failed.", "error");
        } finally {
            setButtonLoading(uploadBtn, "Analyzing...", "Analyze Resume", false);
        }
    });
}
if (loadHistoryBtn) {
    loadHistoryBtn.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            if (historyList) {
                historyList.innerHTML = "<p>Please login first.</p>";
            }
            showGlobalMessage("Please login first.", "error");
            return;
        }
        setButtonLoading(loadHistoryBtn, "Loading...", "Load My Analyses", true);
        try {
            const response = await fetch(`${API_BASE}/api/resumes`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await safeJson(response);
            if (!response.ok) {
                if (historyList) {
                    historyList.innerHTML = `<p>${data?.message || "Failed to load history."}</p>`;
                }
                showGlobalMessage("Failed to load history.", "error");
                return;
            }
            if (!Array.isArray(data)) {
                if (historyList) {
                    historyList.innerHTML = "<p>Invalid history response.</p>";
                }
                showGlobalMessage("Invalid history response.", "error");
                return;
            }
            allHistoryItems = data;
            renderHistory(allHistoryItems);
            updateDashboardStats(allHistoryItems);
            showGlobalMessage("History loaded successfully.");
        } catch (error) {
            if (historyList) {
                historyList.innerHTML = "<p>Failed to load history.</p>";
            }
            showGlobalMessage("Failed to load history.", "error");
        } finally {
            setButtonLoading(loadHistoryBtn, "Loading...", "Load My Analyses", false);
        }
    });
}
if (historySearch) {
    historySearch.addEventListener("input", () => {
        const query = historySearch.value.toLowerCase().trim();
        if (!query) {
            renderHistory(allHistoryItems);
            return;
        }
        const filtered = allHistoryItems.filter(item =>
            (item.fileName || "").toLowerCase().includes(query)
        );
        renderHistory(filtered);
    });
}
if (downloadReportBtn) {
    downloadReportBtn.addEventListener("click", downloadAnalysisReport);
}
updateAppState();
