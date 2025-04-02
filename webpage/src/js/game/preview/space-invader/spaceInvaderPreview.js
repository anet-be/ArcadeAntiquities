import {initializeGame, startGame} from "./Game.js";
import {initializeEnemy} from "./Enemy.js";

export function showSpaceInvaderPreview(canvas) {
    if (!canvas) return console.error("Element #canvas not found.");

    canvas.style.display = "block";
    import("./Game.js")
        .then(() => {
            initializeGame(canvas);
            startGame();
    })
}
