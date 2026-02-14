const API_BASE = "https://staffnexa-backend.onrender.com";

// ===== LOGIN FUNCTION =====
async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    // Create Basic Auth token
    const token = btoa(`${username}:${password}`);

    try {
        // Test API call
        const response = await fetch(`${API_BASE}/candidates`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${token}`
            }
        });

        if (response.status === 401) {
            alert("Invalid credentials");
            return;
        }

        // Save token
        localStorage.setItem("authToken", token);

        // Redirect to dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login error:", error);
        alert("Server not responding");
    }
}
