import {assetArray} from "../../gameData.js";
import {createTileMap, didWin, drawTileMap, getEnemies, getPacman, resetTileMap} from "./TileMap.js";
import {drawPacMan, madeFirstMove, powerDotActive, resetPacman} from "./Pacman.js";
import {collideWith, drawEnemy, restEnemy} from "./Enemy.js";

const tileSize = 56;
const velocity = 2;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tileMap = null;
let pacman = null;
let enemies = null;

let gameOverSound = null;
let gameWinSound = null;
let gameOver = false;
let gameWin = false;

export function initSounds() {
    tileMap = createTileMap(tileSize);
    pacman = getPacman(velocity);
    enemies = getEnemies(velocity);

    const gameOverAsset = assetArray.find(asset => asset.name === "gameOver.wav");
    gameOverSound = gameOverAsset ? new Audio(gameOverAsset.url) : null;

    const gameWinAsset = assetArray.find(asset => asset.name === "gameWin.wav");
    gameWinSound = gameWinAsset ? new Audio(gameWinAsset.url) : null;
}

export function gameLoop() {
    drawTileMap(ctx);
    drawGameEnd();
    drawPacMan(ctx, pause(), enemies);
    enemies.forEach(enemy => drawEnemy(ctx, pause(), enemy));
    checkGameOver();
    checkGameWin();
}

function checkGameWin() {
    if (!gameWin) {
        gameWin = didWin();
        if (gameWin) {
            gameWinSound.play();
        }
    }
}

function checkGameOver() {
    if (!gameOver) {
        gameOver = isGameOver();
        if (gameOver) {
            gameOverSound.play();
        }
    }
}

function isGameOver() {
    return enemies.some(enemy => !powerDotActive && collideWith(enemy));
}

function pause() {
    return !madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
    if (gameOver || gameWin) {
        let text = " You Win!";
        if (gameOver) {
            text = "Game Over";
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, canvas.height / 2.5, canvas.width, 80);

        ctx.font = "75px cc-pixel-arcade-display";
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        ctx.fillStyle = gradient;
        ctx.fillText(text, 105, canvas.height / 2);
    }
}

export function startGame() {
    tileMap.setCanvasSize(canvas);
    setInterval(gameLoop, 1000 / 75);
}

export function resetPacmanGame() {
    gameOver = false;
    gameWin = false;
    resetPacman()
    resetTileMap()
    restEnemy()

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    initSounds();
    startGame();
}