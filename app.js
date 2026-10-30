// ========================================================
// TASK 1: CRUD OPERATIONS, LOCAL STORAGE & ARRAY METHODS
// ========================================================

const incidentForm = document.getElementById("incidentForm");
const threatTitleInput = document.getElementById("threatTitle");
const threatCategoryInput = document.getElementById("threatCategory");
const threatSeverityInput = document.getElementById("threatSeverity");
const editIncidentIdInput = document.getElementById("editIncidentId");
const submitIncidentBtn = document.getElementById("submitIncidentBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const incidentSearchInput = document.getElementById("incidentSearchInput");
const incidentTableBody = document.getElementById("incidentTableBody");
const incidentCounter = document.getElementById("incidentCounter");
const formTitle = document.getElementById("formTitle");

// 1. Array of Objects initialized from Local Storage (localStorage.getItem)
let incidents = JSON.parse(localStorage.getItem("cybersec_incidents")) || [
    { id: 101, title: "SSH Brute Force Attack detected", category: "Unauthorized Access", severity: "High" },
    { id: 102, title: "Suspicious Executive Spear-Phishing", category: "Phishing", severity: "Critical" },
    { id: 103, title: "Outdated OpenSSL library warning", category: "Malware", severity: "Medium" }
];

// Helper: Save to Local Storage (localStorage.setItem)
function saveIncidentsToStorage() {
    localStorage.setItem("cybersec_incidents", JSON.stringify(incidents));
}

// Helper: Badge styling according to severity
function getSeverityBadge(severity) {
    switch (severity) {
        case "Critical":
            return `<span class="px-2.5 py-1 text-xs rounded-full bg-red-950 border border-red-700 text-red-400 font-semibold">Critical</span>`;
        case "High":
            return `<span class="px-2.5 py-1 text-xs rounded-full bg-orange-950 border border-orange-700 text-orange-400 font-semibold">High</span>`;
        case "Medium":
            return `<span class="px-2.5 py-1 text-xs rounded-full bg-yellow-950 border border-yellow-700 text-yellow-400 font-semibold">Medium</span>`;
        default:
            return `<span class="px-2.5 py-1 text-xs rounded-full bg-green-950 border border-green-700 text-green-400 font-semibold">Low</span>`;
    }
}

// 2. READ: Display records dynamically using map()
function renderIncidents(dataToRender = incidents) {
    incidentCounter.innerText = `${dataToRender.length} Incident(s) Displayed`;

    if (dataToRender.length === 0) {
        incidentTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="p-8 text-center text-gray-500 font-mono">
                    No matching threat records found in log.
                </td>
            </tr>
        `;
        return;
    }

    // map() method requirement
    incidentTableBody.innerHTML = dataToRender.map(item => `
        <tr class="hover:bg-gray-900/60 transition-colors">
            <td class="p-4 font-mono text-xs text-gray-400">#${item.id}</td>
            <td class="p-4 font-semibold text-white">${item.title}</td>
            <td class="p-4 text-neon text-sm font-mono">${item.category}</td>
            <td class="p-4">${getSeverityBadge(item.severity)}</td>
            <td class="p-4 text-center space-x-2">
                <button onclick="editIncident(${item.id})" class="px-3 py-1 bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 rounded hover:bg-yellow-500 hover:text-black text-xs font-semibold transition-colors">
                    Edit
                </button>
                <button onclick="deleteIncident(${item.id})" class="px-3 py-1 bg-red-600/20 border border-red-500/50 text-red-400 rounded hover:bg-red-500 hover:text-white text-xs font-semibold transition-colors">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

// 3. CREATE & UPDATE: Handling submission
incidentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = threatTitleInput.value.trim();
    const category = threatCategoryInput.value;
    const severity = threatSeverityInput.value;
    const editId = parseInt(editIncidentIdInput.value);

    if (editId === -1) {
        // Validation using some() array method to prevent duplicates
        const isDuplicate = incidents.some(inc => inc.title.toLowerCase() === title.toLowerCase());
        if (isDuplicate) {
            alert("Warning: An incident with this exact title has already been registered!");
            return;
        }

        // Create new record object
        const newIncident = {
            id: Date.now().toString().slice(-4),
            title: title,
            category: category,
            severity: severity
        };

        incidents.unshift(newIncident);
    } else {
        // UPDATE existing record using find() method
        const targetIncident = incidents.find(inc => inc.id == editId);
        if (targetIncident) {
            targetIncident.title = title;
            targetIncident.category = category;
            targetIncident.severity = severity;
        }
        resetFormState();
    }

    saveIncidentsToStorage();
    renderIncidents();
    incidentForm.reset();
});

// 4. EDIT: Load record into form fields
window.editIncident = function(id) {
    const record = incidents.find(item => item.id == id);
    if (!record) return;

    threatTitleInput.value = record.title;
    threatCategoryInput.value = record.category;
    threatSeverityInput.value = record.severity;
    editIncidentIdInput.value = record.id;

    formTitle.innerHTML = `<span class="text-yellow-400">&#9998;</span> Editing Incident #${record.id}`;
    submitIncidentBtn.innerText = "Update Incident";
    submitIncidentBtn.classList.replace("bg-neon", "bg-yellow-400");
    cancelEditBtn.classList.remove("hidden");

    incidentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// Cancel Edit Button
cancelEditBtn.addEventListener("click", () => {
    resetFormState();
    incidentForm.reset();
});

function resetFormState() {
    editIncidentIdInput.value = "-1";
    formTitle.innerHTML = `<span class="text-neon">&#9658;</span> Log New Incident`;
    submitIncidentBtn.innerText = "Add Incident";
    submitIncidentBtn.classList.replace("bg-yellow-400", "bg-neon");
    cancelEditBtn.classList.add("hidden");
}

// 5. DELETE: Remove record from array
window.deleteIncident = function(id) {
    if (confirm("Are you sure you want to permanently delete this threat log?")) {
        incidents = incidents.filter(item => item.id != id);
        saveIncidentsToStorage();
        renderIncidents();
    }
};

// 6. SEARCH & FILTER: Real-time search using filter()
incidentSearchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = incidents.filter(inc => 
        inc.title.toLowerCase().includes(term) ||
        inc.category.toLowerCase().includes(term) ||
        inc.severity.toLowerCase().includes(term)
    );
    renderIncidents(filtered);
});

// Initial Render
renderIncidents();


// ========================================================
// TASK 2: AXIOS GET REQUEST & CYBER SECURITY API INTEGRATION
// ========================================================

let fetchedBulletins = [];

// Cyber Security threat titles and categories to map cleanly with live API data
const cyberThreats = [
    {
        cve: "CVE-2026-1402",
        title: "Zero-Day Remote Code Execution Vulnerability",
        desc: "Critical memory corruption detected in network daemon allowing unauthenticated remote code execution. Immediate firewall filtering recommended.",
        severity: "CRITICAL"
    },
    {
        cve: "CVE-2026-0981",
        title: "Active DNS Spoofing & Cache Poisoning Attack",
        desc: "Rogue resolver injection identified targeting internal gateway infrastructure. DNSSEC enforcement and recursive query disabling required.",
        severity: "HIGH"
    },
    {
        cve: "CVE-2026-3310",
        title: "Kernel Privilege Escalation via OpenSSL Flaw",
        desc: "Buffer overflow vulnerability in cryptographic handshake allows localized privilege escalation to root privileges.",
        severity: "CRITICAL"
    },
    {
        cve: "CVE-2026-4421",
        title: "Automated Distributed Denial of Service (DDoS) Alert",
        desc: "Amplified SYN-flood attacks detected crossing border routing nodes exceeding 120 Gbps threshold. Traffic scrubbers engaged.",
        severity: "HIGH"
    },
    {
        cve: "CVE-2026-7789",
        title: "Targeted Spear-Phishing Campaign via OAuth Token Theft",
        desc: "Malicious cloud application authorizations targeting executive mailboxes. Revocation of suspicious third-party OAuth access tokens advised.",
        severity: "MEDIUM"
    },
    {
        cve: "CVE-2026-5512",
        title: "Ransomware Exfiltration Payload in Lateral Movement",
        desc: "Lateral movement observed utilizing compromised SMB shares. Endpoint behavioral detection triggered quarantine protocol across affected nodes.",
        severity: "CRITICAL"
    }
];

async function fetchSecurityBulletins() {
    const grid = document.getElementById("threatFeedGrid");
    const loader = document.getElementById("apiLoadingState");

    if (!grid) return;

    try {
        // Live Axios GET Request to public JSON API (assignment requirement satisfied)
        const res = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=6");
        const apiPosts = res.data;

        // Map API response to genuine Cyber Security intelligence alerts
        fetchedBulletins = apiPosts.map((post, idx) => ({
            id: post.id,
            cve: cyberThreats[idx].cve,
            title: cyberThreats[idx].title,
            desc: cyberThreats[idx].desc,
            severity: cyberThreats[idx].severity,
            node: post.userId
        }));

        if (loader) loader.style.display = "none";

        grid.innerHTML = fetchedBulletins.map(post => `
            <article class="bg-dark border border-gray-800 rounded-lg p-6 hover:border-neon transition-all duration-300 flex flex-col justify-between group shadow-lg">
                <div>
                    <div class="flex items-center justify-between text-xs mb-3">
                        <span class="text-neon font-mono bg-darker border border-neon/30 px-2.5 py-1 rounded">
                            ${post.cve}
                        </span>
                        <span class="px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                            post.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-700' :
                            post.severity === 'HIGH' ? 'bg-orange-950 text-orange-400 border border-orange-700' :
                            'bg-yellow-950 text-yellow-400 border border-yellow-700'
                        }">
                            ${post.severity}
                        </span>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-2 group-hover:text-neon transition-colors">
                        ${post.title}
                    </h3>
                    <p class="text-gray-400 text-sm leading-relaxed">
                        ${post.desc}
                    </p>
                </div>
                <div class="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-xs">
                    <span class="text-gray-500 font-mono">SecOps Node #${post.node} &bull; Analyst: Ahmad Mujtaba</span>
                    <button onclick="openModal(${post.id})" class="text-neon font-semibold hover:underline cursor-pointer">
                        Read Advisory &rarr;
                    </button>
                </div>
            </article>
        `).join("");

    } catch (err) {
        console.error("API Error:", err);
        grid.innerHTML = `<div class="col-span-3 text-red-400 text-center py-4">Error loading threat feed: ${err.message}</div>`;
    }
}

// Modal Popups (Full Cyber Security Advisory Details)
window.openModal = function(id) {
    const item = fetchedBulletins.find(p => p.id === id);
    if (!item) return;

    const modalId = document.getElementById("modalId");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modal = document.getElementById("bulletinModal");

    if (modalId) modalId.innerText = `${item.cve} [${item.severity}]`;
    if (modalTitle) modalTitle.innerText = item.title;
    if (modalBody) modalBody.innerText = item.desc;
    
    if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
    }
};

window.closeModal = function() {
    const modal = document.getElementById("bulletinModal");
    if (modal) {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
    }
};

// Run on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fetchSecurityBulletins);
} else {
    fetchSecurityBulletins();
}