import {assetArray} from "../../gameData.js";
import {initializeEnemy} from "./Enemy.js";
import {createEnemyController, initializeEnemyController, resetEnemyController} from "./EnemyController.js";
import {createPlayer, initializePlayer, resetPlayer} from "./Player.js";
import {createBulletController, initializeBulletController, resetBulletController} from "./BulletController.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let background = null;

let playerBulletController = null;
let enemyBulletController = null;
let enemyController = null;
let player = null;

let isGameOver = false;
let didWin = false;
let isPaused = false;

export function initializeGame() {
    initializeEnemy()
    initializePlayer();
    initializeEnemyController();

    initializeBulletController();

    playerBulletController = createBulletController(canvas, 20, "red", true);
    enemyBulletController = createBulletController(canvas, 4, "white", false);
    enemyController = createEnemyController(
        canvas,
        enemyBulletController,
        playerBulletController
    );
    player = createPlayer(canvas, 3, playerBulletController);

    const backgroundAsset = assetArray.find(asset => asset.name === "space.png");
    background = new Image();
    background.src = backgroundAsset.url;
}

function gameLoop() {
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();

    if (!isGameOver) {
        enemyController.draw(ctx, isPaused);
        player.draw(ctx, isPaused);
        playerBulletController.draw(ctx, isPaused);
        enemyBulletController.draw(ctx, isPaused);
    }
}

function displayGameOver() {
    if (isGameOver) {
        let text = didWin ? "You Win" : "Game Over";
        let textOffset = didWin ? 3.5 : 5;

        ctx.fillStyle = "white";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
}

function checkGameOver() {
    if (isGameOver) {
        return;
    }

    if (enemyBulletController.collideWith(player)) {
        isGameOver = true;
    }

    if (enemyController.collideWith(player)) {
        isGameOver = true;
    }

    if (enemyController.enemyRows.length === 0) {
        didWin = true;
        isGameOver = true;
    }
}


export function startGame() {
    setInterval(gameLoop, 1000 / 75);
}

export function resetSpaceGame() {
    isGameOver = false;
    didWin = false;
    isPaused = false;
    resetBulletController();
    resetPlayer()
    resetEnemyController();

    initializeGame()
    gameLoop()
}