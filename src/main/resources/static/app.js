const API_BASE = "http://localhost:8080";

const healthBtn = document.getElementById("healthBtn");
const healthResult = document.getElementById("healthResult");

const registerForm = document.getElementById("registerForm");
const registerResult = document.getElementById("registerResult");

const loginForm = document.getElementById("loginForm");
const loginResult = document.getElementById("loginResult");

const tokenStatus = document.getElementById("tokenStatus");
const logoutBtn = document.getElementById("logoutBtn");

function updateTokenStatus() {
    const token = localStorage.getItem("token");
    tokenStatus.textContent = token ? "Token saved" : "No token saved";
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

updateTokenStatus();
