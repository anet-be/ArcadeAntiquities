import {initSounds, startGame} from "./Game.js";

export function showPacManPreview(canvas) {
    if (!canvas) return console.error("Element #canvas not found.");

    canvas.style.display = "block";

    import("./Game.js")
        .then(() => {
            initSounds();
            startGame();
        })
        .catch((error) => console.error("Error loading Pac-Man game script:", error));
}