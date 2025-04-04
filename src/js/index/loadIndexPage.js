import {createProject, deleteProject, fetchGames, fetchProjects} from "./restIndex.js";
import {Modal} from "bootstrap";

document.addEventListener("DOMContentLoaded", async function () {
    const projects = await fetchProjects();
    console.log(projects);
    const container = document.getElementById("project-container");
    container.innerHTML = "";

    const projectButton = document.getElementById("create-project");
    const modalElement = document.getElementById("exampleModal");
    const modal = new Modal(modalElement);

    projectButton.addEventListener("click", () => handleCreateProject(modal, container));

    const games = await fetchGames();
    populateGameDropdown(games);

    if (!Array.isArray(projects) || projects.length === 0) {
        displayNoProjectsMessage(container);
    } else {
        displayProjectCards(projects, container);
    }
});

async function handleCreateProject(modal, container) {
    const projectName = getInputValue("inputName");
    const projectDescription = getInputValue("inputDescription");

    const selectedGames = Array.from(document.querySelectorAll('input[name="games"]:checked')).map(checkbox => checkbox.value);

    if (!validateProjectFields(projectName, projectDescription) || !validateGameCheckBoxes(selectedGames)){
        clearInputFields("inputName", "inputDescription");
        return;
    }

    console.log("selected games: " + selectedGames)

    const newProject = await createProject({
        name: projectName,
        description: projectDescription,
        gameIds: selectedGames
    });

    modal.hide();

    clearInputFields("inputName", "inputDescription");

    const projectCard = createProjectCard(newProject);
    container.appendChild(projectCard);
}

function getInputValue(inputId) {
    const input = document.getElementById(inputId);
    return input ? input.value.trim() : "";
}

function validateProjectFields(projectName, projectDescription) {
    if (!projectName || !projectDescription) {
        alert("Please fill in both fields.");
        return false;
    }
    return true;
}

function validateGameCheckBoxes(selectedGames){
    if (selectedGames.length === 0) {
        alert("Please select 1 game");
        return false;
    }
    return true;
}

function clearInputFields(...inputIds) {
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = "";
    });
    document.querySelectorAll('input[name="games"]').forEach(checkbox => checkbox.checked = false);
}

function displayNoProjectsMessage(container) {
    const noProjectsMsg = document.createElement("p");
    noProjectsMsg.textContent = "No projects found.";
    noProjectsMsg.classList.add("text-center", "text-danger", "fw-bold");
    container.appendChild(noProjectsMsg);
}

function displayProjectCards(projects, container) {
    projects.forEach((project) => {
        const projectCard = createProjectCard(project);
        container.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const col = document.createElement("div");
    col.classList.add("col");

    col.innerHTML = `
        <div class="card h-100 clickable-card position-relative">
            <img src="http://localhost:8081/assets/project_background.jpg" 
                    class="card-img-top" alt="Project Image">
            <div class="card-img-overlay d-flex flex-column justify-content-center text-white text-center">
                <i class="bi bi-trash-fill position-absolute top-0 end-0 m-2 delete-icon" data-id="${project.id}"></i>
                <h5 class="card-title">${project.name}</h5>
                <p class="card-text">${project.description}</p>
            </div>
        </div>
    `;

    const trashIcon = col.querySelector(".delete-icon");
    trashIcon.addEventListener("click", async (event) => {
        event.stopPropagation();
        await handleDeleteProject(project.id, col);
    });

    col.addEventListener("click", () => redirectToProjectPage(project.id));

    return col;
}

async function handleDeleteProject(id, projectElement) {
    const confirmDelete = confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
        await deleteProject(id);
        projectElement.remove();
    } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project. Please try again.");
    }
}

function redirectToProjectPage(id) {
    window.location.href = `projectPage?projectId=${id}`;
}

function populateGameDropdown(games) {
    const gameSelectContainer = document.getElementById("inputGames");
    gameSelectContainer.innerHTML = "";

    games.forEach((game) => {
        const gameDiv = document.createElement("div");
        gameDiv.classList.add("form-check");

        const checkbox = document.createElement("input");
        checkbox.classList.add("form-check-input");
        checkbox.type = "checkbox";
        checkbox.name = "games";
        checkbox.value = game.id;
        checkbox.id = `game-${game.id}`;

        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.setAttribute("for", `game-${game.id}`);
        label.textContent = game.name;

        gameDiv.appendChild(checkbox);
        gameDiv.appendChild(label);

        gameSelectContainer.appendChild(gameDiv);
    });
}
