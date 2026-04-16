const API_BASE = "http://localhost:8080";

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

let allHistoryItems = [];
let currentAnalysis = null;

function updateAppState() {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (token) {
        introSection.classList.add("hidden");
        authSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        logoutBtn.classList.remove("hidden");
        userWelcome.classList.remove("hidden");
        userWelcome.textContent = email ? `Welcome, ${email}` : "Welcome";
    } else {
        introSection.classList.remove("hidden");
        authSection.classList.remove("hidden");
        dashboardSection.classList.add("hidden");
        logoutBtn.classList.add("hidden");
        userWelcome.classList.add("hidden");
        userWelcome.textContent = "";

        analysisSection.classList.add("hidden");
        emptyStateCard.classList.remove("hidden");

        currentAnalysis = null;
        allHistoryItems = [];
    }
}

function showGlobalMessage(message, type = "success") {
    globalMessage.textContent = message;
    globalMessage.className = `global-message ${type}`;
    setTimeout(() => {
        globalMessage.className = "global-message hidden";
        globalMessage.textContent = "";
    }, 3000);
}

function setButtonLoading(button, loadingText, originalText, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : originalText;
}

function renderAnalysis(data) {
    currentAnalysis = data;
    analysisSection.classList.remove("hidden");
    emptyStateCard.classList.add("hidden");

    analysisResult.innerHTML = `
        <div class="analysis-section">
            <h3>File Name</h3>
            <p>${data.fileName || "-"}</p>
        </div>
        <div class="analysis-section">
            <h3>Score</h3>
            <p>${data.score ?? 0}</p>
        </div>
        <div class="analysis-section">
            <h3>Strengths</h3>
            <p>${data.strengths || "-"}</p>
        </div>
        <div class="analysis-section">
            <h3>Weaknesses</h3>
            <p>${data.weaknesses || "-"}</p>
        </div>
        <div class="analysis-section">
            <h3>Improvements</h3>
            <p>${data.improvements || "-"}</p>
        </div>
        <div class="analysis-section">
            <h3>Summary</h3>
            <p>${data.summary || "-"}</p>
        </div>
        <div class="analysis-section">
            <h3>Full Feedback</h3>
            <p>${data.feedback || "-"}</p>
        </div>
    `;
}

function updateDashboardStats(items) {
    totalAnalyses.textContent = items.length;

    if (!items.length) {
        averageScore.textContent = "0";
        latestResume.textContent = "No data";
        return;
    }

    const total = items.reduce((sum, item) => sum + (item.score || 0), 0);
    averageScore.textContent = Math.round(total / items.length);
    latestResume.textContent = items[0].fileName || "Unknown";
}

function renderHistory(items) {
    if (!items.length) {
        historyList.innerHTML = "<p>No analyses found.</p>";
        return;
    }

    historyList.innerHTML = items.map(item => `
        <div class="history-item" data-id="${item.id}">
            <h3>${item.fileName || "Untitled Resume"}</h3>
            <p><strong>Score:</strong> ${item.score ?? 0}</p>
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

        const data = await response.json();

        if (!response.ok) {
            showGlobalMessage(data.message || "Failed to load analysis.", "error");
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
Score: ${currentAnalysis.score ?? 0}
Created At: ${currentAnalysis.createdAt || "-"}

Strengths:
${currentAnalysis.strengths || "-"}

Weaknesses:
${currentAnalysis.weaknesses || "-"}

Improvements:
${currentAnalysis.improvements || "-"}

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

healthBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        healthResult.textContent = `${data.status} - ${data.service}`;
        showGlobalMessage("Backend is reachable.");
    } catch (error) {
        healthResult.textContent = "Backend connection failed";
        showGlobalMessage("Backend connection failed.", "error");
    }
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setButtonLoading(registerBtn, "Registering...", "Register", true);

    const payload = {
        fullName: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value
    };

    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            registerResult.textContent = data.message || "Registration failed";
            showGlobalMessage(registerResult.textContent, "error");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);

        registerResult.textContent = `Registered: ${data.email}`;
        showGlobalMessage("Registration successful.");
        updateAppState();
    } catch (error) {
        registerResult.textContent = "Registration failed";
        showGlobalMessage("Registration failed.", "error");
    } finally {
        setButtonLoading(registerBtn, "Registering...", "Register", false);
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setButtonLoading(loginBtn, "Logging in...", "Login", true);

    const payload = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            loginResult.textContent = data.message || "Login failed";
            showGlobalMessage(loginResult.textContent, "error");
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);

        loginResult.textContent = `Logged in as ${data.email}`;
        showGlobalMessage("Login successful.");
        updateAppState();
    } catch (error) {
        loginResult.textContent = "Login failed";
        showGlobalMessage("Login failed.", "error");
    } finally {
        setButtonLoading(loginBtn, "Logging in...", "Login", false);
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    loginResult.textContent = "Logged out";
    registerResult.textContent = "";
    uploadResult.textContent = "";
    historyList.innerHTML = "<p>No history loaded yet.</p>";
    analysisResult.innerHTML = "<p>No analysis yet.</p>";
    updateDashboardStats([]);
    updateAppState();
    showGlobalMessage("Logged out successfully.");
});

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        uploadResult.textContent = "Please login first.";
        showGlobalMessage("Please login first.", "error");
        return;
    }

    const fileInput = document.getElementById("resumeFile");
    const jobDescription = document.getElementById("jobDescription").value;

    if (!fileInput.files.length) {
        uploadResult.textContent = "Please choose a PDF file.";
        showGlobalMessage("Please choose a PDF file.", "error");
        return;
    }

    setButtonLoading(uploadBtn, "Analyzing...", "Analyze Resume", true);

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

        const data = await response.json();

        if (!response.ok) {
            uploadResult.textContent = data.message || "Upload failed";
            showGlobalMessage(uploadResult.textContent, "error");
            return;
        }

        uploadResult.textContent = "Resume uploaded and analyzed successfully.";
        renderAnalysis(data);
        showGlobalMessage("Resume analyzed successfully.");
    } catch (error) {
        uploadResult.textContent = "Upload failed.";
        showGlobalMessage("Upload failed.", "error");
    } finally {
        setButtonLoading(uploadBtn, "Analyzing...", "Analyze Resume", false);
    }
});

loadHistoryBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        historyList.innerHTML = "<p>Please login first.</p>";
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

        const data = await response.json();

        if (!response.ok) {
            historyList.innerHTML = `<p>${data.message || "Failed to load history."}</p>`;
            showGlobalMessage("Failed to load history.", "error");
            return;
        }

        allHistoryItems = data;
        renderHistory(allHistoryItems);
        updateDashboardStats(allHistoryItems);
        showGlobalMessage("History loaded successfully.");
    } catch (error) {
        historyList.innerHTML = "<p>Failed to load history.</p>";
        showGlobalMessage("Failed to load history.", "error");
    } finally {
        setButtonLoading(loadHistoryBtn, "Loading...", "Load My Analyses", false);
    }
});

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

downloadReportBtn.addEventListener("click", downloadAnalysisReport);

updateAppState();
