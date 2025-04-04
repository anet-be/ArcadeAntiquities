import { assetArray, loadGameData } from "./gameData.js";
import { showPreview } from "./preview.js";
import { createGameVersion, fetchProjectByGameVersion } from "./restGame.js";

document.addEventListener("DOMContentLoaded", async () => {
    const gameId = getGameId();
    if (!gameId) return;

    await initializeGame(gameId);
    setupAddVersionButton(gameId);
    setupEditableTitle();
});

function getGameId() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");
    if (!gameId) console.error("No gameId found in the URL.");
    return gameId;
}

async function initializeGame(gameId) {
    try {
        await loadGameData(gameId);
        await showPreview();
    } catch (error) {
        console.error("Error fetching game data:", error);
    }
}

function setupAddVersionButton(gameId) {
    document.getElementById("add-version")?.addEventListener("click", async () => {
        try {
            const gameTitle = document.getElementById("game-title")?.textContent || "Untitled Game";
            await createGameVersion(gameId, gameTitle, "no rules yet", formatAssetArray());
            await redirectToProject(gameId);
        } catch (error) {
            console.error("Error creating game version:", error);
            alert("Failed to create game version. Please try again.");
        }
    });
}

function formatAssetArray() {
    console.log(assetArray);
    return assetArray.map(({ id, name, url, assetType }) => ({
        id,
        fileName: name,
        url: url.replace("http://localhost:8081/", ""),
        assetType
    }));
}

async function redirectToProject(gameId) {
    const projectId = await fetchProjectByGameVersion(gameId);
    if (projectId) window.location.href = `projectPage?projectId=${projectId}`;
}

function setupEditableTitle() {
    const titleElement = document.getElementById("game-title");
    if (!titleElement) return;

    titleElement.addEventListener("dblclick", () => {
        titleElement.setAttribute("contenteditable", "true");
        titleElement.focus();
    });

    titleElement.addEventListener("blur", () => {
        titleElement.removeAttribute("contenteditable");
    });

    titleElement.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            titleElement.removeAttribute("contenteditable");
            document.getElementById("add-version").classList.remove("disabled");
        }
    });
}