<script>
const API_BASE = "https://staffnexa-backend.onrender.com";

let candidates = [];
let selectedIds = new Set();

// ===== AUTH =====
function getToken() {
    const token = localStorage.getItem("adminAuth");

    if (!token) {
        window.location.href = "index.html";
        return null;
    }

    return token;
}

// ===== FETCH DATA =====
async function fetchCandidates() {
    const token = getToken();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE}/candidates`, {
            headers: {
                "Authorization": "Basic " + token
            }
        });

        if (!response.ok) {
            localStorage.removeItem("adminAuth");
            window.location.href = "index.html";
            return;
        }

        const data = await response.json();

        // MAP BACKEND DATA TO UI FORMAT
        candidates = data.map((c, index) => ({
            id: c._id,
            name: c.name || c.fullName || "N/A",
            phone: c.phone || c.mobile || "",
            role: c.jobRole || c.role || "N/A",
            location: c.location || c.city || "N/A",
            date: new Date(c.createdAt).toLocaleString()
        }));

        renderTable();

    } catch (error) {
        console.error(error);
        alert("Failed to load candidates");
    }
}

// ===== RENDER TABLE (UNCHANGED UI) =====
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const locationFilter = document.getElementById('locationFilter');
    const showingCountSpan = document.getElementById('showingCount');
    const totalEntriesSpan = document.getElementById('totalEntries');
    const totalCountDisplay = document.getElementById('total-count');
    const selectAllCheckbox = document.getElementById('selectAll');

    tableBody.innerHTML = '';

    const searchTerm = searchInput.value.toLowerCase();
    const roleTerm = roleFilter.value;
    const locationTerm = locationFilter.value;

    const filteredData = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm) || candidate.phone.includes(searchTerm);
        const matchesRole = roleTerm ? candidate.role === roleTerm : true;
        const matchesLocation = locationTerm ? candidate.location === locationTerm : true;
        return matchesSearch && matchesRole && matchesLocation;
    });

    showingCountSpan.textContent = filteredData.length;
    totalEntriesSpan.textContent = candidates.length;
    totalCountDisplay.textContent = candidates.length;

    if (filteredData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center">No data</td></tr>`;
        return;
    }

    filteredData.forEach(candidate => {
        const isSelected = selectedIds.has(candidate.id);

        tableBody.innerHTML += `
            <tr class="${isSelected ? 'bg-indigo-50' : ''}">
                <td class="p-5">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleRow('${candidate.id}')">
                </td>
                <td class="p-5">${candidate.name}</td>
                <td class="p-5">${candidate.phone}</td>
                <td class="p-5">${candidate.role}</td>
                <td class="p-5">${candidate.location}</td>
                <td class="p-5">${candidate.date}</td>
                <td class="p-5 text-right">
                    <button onclick="deleteCandidate('${candidate.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// ===== DELETE =====
async function deleteCandidate(id) {
    if (!confirm("Delete this candidate?")) return;

    const token = getToken();

    await fetch(`${API_BASE}/candidates/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Basic " + token
        }
    });

    fetchCandidates();
}

// ===== SELECTION =====
function toggleRow(id) {
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);

    renderTable();
}

// ===== EVENTS =====
document.getElementById('searchInput').addEventListener('input', renderTable);
document.getElementById('roleFilter').addEventListener('change', renderTable);
document.getElementById('locationFilter').addEventListener('change', renderTable);

// ===== INIT =====
fetchCandidates();
</script>
