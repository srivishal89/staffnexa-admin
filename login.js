const API_BASE = "https://staffnexa-backend.onrender.com";

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const btn = document.getElementById("loginBtn");

    if (!username || !password) {
        alert("Enter username and password");
        return;
    }

    const token = btoa(`${username}:${password}`);

    // Prevent multiple clicks
    btn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/candidates`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${token}`
            }
        });

        if (response.status === 401) {
            alert("Invalid credentials");
            btn.disabled = false;
            return;
        }

        // SAVE TOKEN (CRITICAL)
        localStorage.setItem("authToken", token);

        // REDIRECT
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error(error);
        alert("Server error");
        btn.disabled = false;
    }
}
