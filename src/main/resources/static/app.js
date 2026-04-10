const API_BASE = "http://localhost:8080";

const healthBtn = document.getElementById("healthBtn");
const healthResult = document.getElementById("healthResult");
const registerForm = document.getElementById("registerForm");
const registerResult = document.getElementById("registerResult");
const loginForm = document.getElementById("loginForm");
const loginResult = document.getElementById("loginResult");
const tokenStatus = document.getElementById("tokenStatus");
const logoutBtn = document.getElementById("logoutBtn");
const uploadForm = document.getElementById("uploadForm");
const uploadResult = document.getElementById("uploadResult");
const analysisResult = document.getElementById("analysisResult");
const loadHistoryBtn = document.getElementById("loadHistoryBtn");
const historyList = document.getElementById("historyList");


function updateTokenStatus() {
    const token = localStorage.getItem("token");
    tokenStatus.textContent = token ? "Token saved" : "No token saved";
}

function renderAnalysis(data) {
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
        historyList.innerHTML = "<p>Please login first.</p>";
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
            historyList.innerHTML = `<p>${data.message || "Failed to load analysis."}</p>`;
            return;
        }

        renderAnalysis(data);
    } catch (error) {
        historyList.innerHTML = "<p>Failed to load selected analysis.</p>";
    }
}

healthBtn.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        healthResult.textContent = `${data.status} - ${data.service}`;
    } catch (error) {
        healthResult.textContent = "Backend connection failed";
    }
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        fullName: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        password: document.getElementById("registerPassword").value
    };

    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            registerResult.textContent = data.message || "Registration failed";
            return;
        }

        registerResult.textContent = `Registered: ${data.email}`;
        if (data.token) {
            localStorage.setItem("token", data.token);
            updateTokenStatus();
        }
    } catch (error) {
        registerResult.textContent = "Registration failed";
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            loginResult.textContent = data.message || "Login failed";
            return;
        }

        localStorage.setItem("token", data.token);
        loginResult.textContent = `Logged in as ${data.email}`;
        updateTokenStatus();
    } catch (error) {
        loginResult.textContent = "Login failed";
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    updateTokenStatus();
    loginResult.textContent = "Logged out";
});

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        uploadResult.textContent = "Please login first.";
        return;
    }

    const fileInput = document.getElementById("resumeFile");
    const jobDescription = document.getElementById("jobDescription").value;

    if (!fileInput.files.length) {
        uploadResult.textContent = "Please choose a PDF file.";
        return;
    }

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
            return;
        }

        uploadResult.textContent = "Resume uploaded and analyzed successfully.";
        renderAnalysis(data);
    } catch (error) {
        uploadResult.textContent = "Upload failed.";
    }
});
loadHistoryBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        historyList.innerHTML = "<p>Please login first.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/resumes`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            historyList.innerHTML = `<p>${data.message || "Failed to load history."}</p>`;
            return;
        }

        renderHistory(data);
    } catch (error) {
        historyList.innerHTML = "<p>Failed to load history.</p>";
    }
});

updateTokenStatus();
