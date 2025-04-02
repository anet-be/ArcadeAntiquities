import { showSpaceInvaderPreview } from "./preview/space-invader/spaceInvaderPreview.js";
import { showPacManPreview } from "./preview/pac-man/pacManPreview.Js";
import { game } from "./gameData.js";
import { resetPacmanGame } from "./preview/pac-man/Game.js";
import { resetSpaceGame } from "./preview/space-invader/Game.js";
import {fetchGame} from "./restGame.js";

export let isPreviewLoaded = false;
const canvas = document.getElementById("canvas");

export async function showPreview() {
    const baseGame = await fetchGame(game.baseGameId);

    if (baseGame.name === 'space invaders') {
        showSpaceInvaderPreview(canvas);
    } else if (baseGame.name === 'pac-man') {
        showPacManPreview(canvas);
    }
    isPreviewLoaded = true;
}

export function reloadPreview() {
    clearCanvas();
    hideCanvas();

    setTimeout(() => {
        showPreview();
    }, 100);
}

function clearCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function hideCanvas() {
    canvas.style.display = "none";
}

canvas.addEventListener("click", () => {
    if (game.versionName === 'space invaders') {
        resetSpaceGame(canvas);
    } else if (game.versionName === 'pac-man') {
        resetPacmanGame(canvas);
    }
});
