import {
    createProjectVersion,
    fetchGamesFromProject,
    fetchGamesFromProjectVersion,
    fetchProjectVersionsOfProject, uploadToRaspberryPi
} from "./restProject.js";
import {deleteProject, fetchProject} from "../index/restIndex.js";

let chosenGameIds = null;
let chosenGames = null;
let projectVersions = null;
let selectedVersionId = null;
let games = null;
let projectVersionGames = null;
let initialChosenGameIds;
let projectId;
let allNotChosenGameVersions;
let chosenGameVersions;

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    projectId = urlParams.get("projectId");

    if (!projectId) {
        console.error("No projectId found in the URL.");
        return;
    }

    try {
        await loadProjectData(projectId);
    } catch (error) {
        console.error("Error fetching project version data:", error);
    }
});

async function loadProjectData(projectId) {
    chosenGameIds = null;
    chosenGames = null;
    projectVersions = null;
    games = null;
    projectVersionGames = null;
    selectedVersionId = null;

    const project = await fetchProject(projectId);
    games = await fetchGamesFromProject(projectId);
    projectVersions = await fetchProjectVersionsOfProject(projectId);
    updateProjectTitle(project);
    chosenGames = await populateGameVersionsDropdown(projectVersions);
    initialChosenGameIds = new Set(chosenGames.map(game => game.id));
    displayGames(games, chosenGames);

    const addVersionButton = document.getElementById("add-version-button");
    const addRaspberryPiButton = document.getElementById("add-to-raspberry-pi-button");

    if (addVersionButton) {
        toggleAddVersionButton(addVersionButton); // Check if changes exist
        addVersionButton.addEventListener("click", () => handleAddVersionClick(chosenGames));
    }

    if (addRaspberryPiButton) {
        addRaspberryPiButton.addEventListener("click", () => handleAddToRaspberryPi());
    }
}

function toggleAddVersionButton(addVersionButton) {
    const initialChosenArray = Array.from(initialChosenGameIds);
    const currentChosenArray = Array.from(chosenGameIds);

    if (initialChosenArray.length !== currentChosenArray.length ||
        !initialChosenArray.every(id => currentChosenArray.includes(id))) {
        console.log("Changes detected.");
        addVersionButton.disabled = false;
        addVersionButton.classList.remove("disabled");
    } else {
        console.log("No changes detected.");
        addVersionButton.disabled = true;
        addVersionButton.classList.add("disabled");
    }
}

function updateProjectTitle(project) {
    const projectTitle = document.getElementById("project-title");
    projectTitle.textContent = project?.name || "Unknown Project";
}

async function populateGameVersionsDropdown(projectVersions) {
    const dropdown = document.getElementById("game-versions-dropdown");
    if (!dropdown || projectVersions.length === 0) return;

    dropdown.innerHTML = "";

    projectVersions.sort((a, b) => b.versionNumber - a.versionNumber);

    projectVersions.forEach(version => {
        const option = document.createElement("option");
        option.value = version.id;
        option.textContent = "Version: " + version.versionNumber;
        dropdown.appendChild(option);
    });

    selectedVersionId = projectVersions[0].id;
    dropdown.value = selectedVersionId;

    dropdown.addEventListener("change", async (event) => {
        selectedVersionId = event.target.value;
        await updateGameDisplayForVersion(selectedVersionId);
    });

    return await fetchGamesForSelectedVersion(selectedVersionId);
}

async function updateGameDisplayForVersion(versionId) {
    projectVersionGames = await fetchGamesForSelectedVersion(versionId);

    chosenGames = projectVersionGames;
    if (!chosenGames) {
        chosenGames = [];
    }
    chosenGameIds = new Set(chosenGames.map(game => game.id));

    displayGames(games, chosenGames);
}

async function fetchGamesForSelectedVersion(versionId) {
    return await fetchGamesFromProjectVersion(versionId);
}

function displayGames(games, chosenGames) {
    allNotChosenGameVersions = document.getElementById("all-not-chosen-game-versions");
    allNotChosenGameVersions.innerHTML = "";

    chosenGameVersions = document.getElementById("chosen-game-versions");
    chosenGameVersions.innerHTML = "";

    const sortedGames = [...games].sort((a, b) => b.versionNumber - a.versionNumber);
    const sortedChosenGames = [...chosenGames].sort((a, b) => b.versionNumber - a.versionNumber);

    chosenGameIds = new Set(sortedChosenGames.map(game => game.id));

    if (sortedGames.length === 0) {
        allNotChosenGameVersions.appendChild(createNoGamesMessage());
        chosenGameVersions.appendChild(createNoGamesMessage());
        return;
    }

    sortedGames.forEach((game) => {
        if (chosenGameIds.has(game.id)) {
            chosenGameVersions.appendChild(createChosenGameVersionCard(game));
        } else {
            allNotChosenGameVersions.appendChild(createNotChosenGameVersionCard(game));
        }
    });

    addDragAndDropEvents();
}

function createNoGamesMessage(message) {
    const p = document.createElement("p");
    p.textContent = message || "No games found.";
    p.classList.add("text-center", "text-danger", "fw-bold");
    return p;
}

function createNotChosenGameVersionCard(game) {
    const gameCard = document.createElement("div");
    gameCard.classList.add("col", "mb-2");
    gameCard.setAttribute("draggable", "true");
    gameCard.setAttribute("data-id", game.id);

    gameCard.innerHTML = `
        <div class="card h-100 clickable-card position-relative mb-2">
            <img src="http://localhost:8081/assets/project_background.jpg" 
                    class="card-img-top" alt="game Image">
            <div class="card-img-overlay d-flex flex-column justify-content-center text-white text-center">
                <h5 class="card-title">${game.versionName}</h5>
                <p class="card-text text-black">version ${game.versionNumber}</p>
            </div>
        </div>
    `;

    gameCard.addEventListener("click", () => {
        window.location.href = `gamePage?gameId=${game.id}`;
    });

    gameCard.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("gameId", game.id);
        gameCard.classList.add("dragging");
    });

    gameCard.addEventListener("dragend", () => {
        gameCard.classList.remove("dragging");
    });


    return gameCard;
}

function createChosenGameVersionCard(game) {
    const gameCard = document.createElement("div");
    gameCard.classList.add("mb-2");
    gameCard.setAttribute("draggable", "true");
    gameCard.setAttribute("data-id", game.id);

    gameCard.innerHTML = `
        <div class="card clickable-card position-relative mb-2 h-100">
            <img src="http://localhost:8081/assets/project_background.jpg" 
                    class="card-img-top" alt="game Image">
            <div class="card-img-overlay d-flex flex-column justify-content-center text-white text-center">
                <h5 class="card-title">${game.versionName}</h5>
                <p class="card-text text-black">version ${game.versionNumber}</p>
            </div>
        </div>
    `;

    gameCard.addEventListener("click", () => {
        window.location.href = `gamePage?gameId=${game.id}`;
    });

    gameCard.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("gameId", game.id);
        gameCard.classList.add("dragging");
    });

    gameCard.addEventListener("dragend", () => {
        gameCard.classList.remove("dragging");
    });

    return gameCard;
}

function addDragAndDropEvents() {
    const chosenGameVersions = document.getElementById("chosen-game-versions");
    const allNotChosenGameVersions = document.getElementById("all-not-chosen-game-versions");

    function handleDrop(targetContainer, removeFromContainer, addToSet, removeFromSet) {
        return (event) => {
            event.preventDefault();
            const gameId = event.dataTransfer.getData("gameId");

            // Find the game object from the games list
            const game = games.find(g => g.id === gameId);
            if (!game) return;

            // Remove old card
            const oldCard = document.querySelector(`[data-id="${gameId}"]`);
            if (oldCard) {
                oldCard.remove();
            }

            removeFromSet.delete(gameId);
            addToSet.add(gameId);

            const newCard = targetContainer === chosenGameVersions
                ? createChosenGameVersionCard(game)  // No trash bin
                : createNotChosenGameVersionCard(game); // With trash bin

            targetContainer.appendChild(newCard);

            toggleAddVersionButton(document.getElementById("add-version-button"));
        };
    }

    chosenGameVersions.addEventListener("dragover", (event) => event.preventDefault());
    chosenGameVersions.addEventListener("drop", handleDrop(
        chosenGameVersions,
        allNotChosenGameVersions,
        chosenGameIds,
        new Set()
    ));

    allNotChosenGameVersions.addEventListener("dragover", (event) => event.preventDefault());
    allNotChosenGameVersions.addEventListener("drop", handleDrop(
        allNotChosenGameVersions,
        chosenGameVersions,
        new Set(),
        chosenGameIds
    ));


    chosenGameVersions.addEventListener("dragover", (event) => event.preventDefault());
    chosenGameVersions.addEventListener("drop", handleDrop(chosenGameVersions, allNotChosenGameVersions, chosenGameIds, new Set()));

    allNotChosenGameVersions.addEventListener("dragover", (event) => event.preventDefault());
    allNotChosenGameVersions.addEventListener("drop", handleDrop(allNotChosenGameVersions, chosenGameVersions, new Set(), chosenGameIds));


}

async function handleAddVersionClick() {
    console.log("Adding version with game IDs:", Array.from(chosenGameIds));

    await createProjectVersion(projectId, Array.from(chosenGameIds));
    await loadProjectData(projectId);
}

async function handleAddToRaspberryPi(){
    await uploadToRaspberryPi(selectedVersionId)
}
