const API_BASE = "https://staffnexa-backend.onrender.com";

// ===== GET TOKEN =====
function getAuthToken() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Please login again");
        window.location.href = "index.html";
        return null;
    }

    return token;
}

// ===== FETCH CANDIDATES =====
async function fetchCandidates() {
    const token = getAuthToken();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE}/candidates`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${token}`
            }
        });

        if (response.status === 401) {
            alert("Session expired. Login again.");
            localStorage.removeItem("authToken");
            window.location.href = "index.html";
            return;
        }

        const data = await response.json();
        renderCandidates(data);

    } catch (error) {
        console.error(error);
        alert("Failed to load candidates");
    }
}

// ===== RENDER TABLE =====
function renderCandidates(candidates) {
    const tableBody = document.getElementById("candidateTableBody");

    tableBody.innerHTML = "";

    if (!candidates || candidates.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">No data found</td></tr>`;
        return;
    }

    candidates.forEach((c, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${c.name || ""}</td>
                <td>${c.phone || ""}</td>
                <td>${c.email || ""}</td>
                <td>${c.jobRole || ""}</td>
                <td>
                    <button onclick="deleteCandidate('${c._id}')">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ===== DELETE =====
async function deleteCandidate(id) {
    const confirmDelete = confirm("Delete this candidate?");
    if (!confirmDelete) return;

    const token = getAuthToken();
    if (!token) return;

    try {
        await fetch(`${API_BASE}/candidates/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Basic ${token}`
            }
        });

        fetchCandidates();

    } catch (error) {
        console.error(error);
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", fetchCandidates);
