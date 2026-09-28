// --- 1. SMART DATABASE INITIALIZATION ---
const defaultData = {
    companyName: "Acme Corp Logistics",
    projects: [
        { id: 1, name: "Cloud Migration", budget: 45000, status: "Active" },
        { id: 2, name: "AI Customer Bot", budget: 28000, status: "Active" },
        { id: 3, name: "Security Audit", budget: 12000, status: "Completed" },
        { id: 4, name: "UI Redesign", budget: 15000, status: "Pending" }
    ]
};

let corporateDatabase = JSON.parse(localStorage.getItem("corpData")) || defaultData;


// --- 2. MASTER RENDER ENGINE (METRICS & TABLES) ---
function updateDashboardMetrics() {
    const budgetElement = document.getElementById("total-budget");
    const tasksElement = document.getElementById("active-tasks-count");
    const tableBody = document.getElementById("project-table-body");

    let totalBudgetSum = 0;
    let activeTasksCount = 0;
    
    // Clear out any old rows in the visual table so we don't accidentally duplicate them
    tableBody.innerHTML = "";

    // Loop through each project to calculate data AND build table rows
    corporateDatabase.projects.forEach((project, index) => {
        totalBudgetSum += project.budget;
        if (project.status === "Active") {
            activeTasksCount++;
        }

        // Create a blank row element <tr>
        const row = document.createElement("tr");

        // Construct internal cell data columns <td> using template strings
        row.innerHTML = `
            <td>#${project.id}</td>
            <td><strong>${project.name}</strong></td>
            <td>$${project.budget.toLocaleString()}</td>
            <td><span class="badge ${project.status.toLowerCase()}">${project.status}</span></td>
            <td><button class="delete-btn" onclick="deleteProject(${index})">🗑️ Terminate</button></td>
        `;

        // Inject this complete row right into the table body container on screen
        tableBody.appendChild(row);
    });

    budgetElement.innerText = "\$" + totalBudgetSum.toLocaleString();
    tasksElement.innerText = activeTasksCount;
}


// --- 3. DYNAMIC DELETION LOGIC ---
// This function triggers when someone clicks a "Terminate" button on a row
window.deleteProject = function(index) {
    // Remove exactly 1 item from our project array at the specific index position
    corporateDatabase.projects.splice(index, 1);

    // Save the stripped down database array back into browser storage
    localStorage.setItem("corpData", JSON.stringify(corporateDatabase));

    // Rerun the engine to recalculate top cards and clean up the table rows!
    updateDashboardMetrics();
};


// --- 4. INTERACTIVE INPUT HANDLER WITH SAVE STATE ---
const projectForm = document.getElementById("project-form");

projectForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const nameInput = document.getElementById("proj-name");
    const budgetInput = document.getElementById("proj-budget");

    const newProject = {
        id: corporateDatabase.projects.length > 0 ? corporateDatabase.projects[corporateDatabase.projects.length - 1].id + 1 : 1,
        name: nameInput.value,
        budget: parseFloat(budgetInput.value),
        status: "Active"
    };

    corporateDatabase.projects.push(newProject);
    localStorage.setItem("corpData", JSON.stringify(corporateDatabase));
    updateDashboardMetrics();
    projectForm.reset();
});


// --- 5. INITIALIZE APP ---
updateDashboardMetrics();
