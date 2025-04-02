import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";
import {loadImage} from "../../assetHandler.js"
import {getGameNames} from "../../FileHandler";

const canvas = document.getElementById("spaceInvaderCanvas");
const popup = document.getElementById("popup");
const popupBody = document.getElementById("popupBody");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const backgroundAsset = loadImage("space.png");
const background = new Image();
background.src = backgroundAsset

const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 4, "white", false);
const enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController
);
const player = new Player(canvas, 3, playerBulletController);

const gameArray = [...getGameNames()];

let isGameOver = false;
let didWin = false;
let isPaused = false;
let gameEndCheck = false;
let score = 0;
let highScore = localStorage.getItem("highScoreSpaceInvader") || 0;
highScoreDisplay.textContent = highScore;

function game() {
    checkGameOver();
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    displayScore();
    displayGameOver();
    if (!isGameOver) {
        enemyController.draw(ctx, isPaused);
        player.draw(ctx, isPaused);
        playerBulletController.draw(ctx, isPaused);
        enemyBulletController.draw(ctx, isPaused);
    }
}

function displayScore() {
    score = enemyController.enemyDeathScore * 10;
    scoreDisplay.textContent = score;

    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem("highScoreSpaceInvader", highScore);
    }
}

function displayGameOver() {
    if (isGameOver) {
        let text = didWin ? "You Win" : "Game Over";
        let textOffset = didWin ? 3.5 : 5;

        ctx.fillStyle = "white";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);

        if (!gameEndCheck) {
            gameEndCheck = true;
            drawPopup();
            popup.style.display = "flex";
        }
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

function drawPopup() {
    if (isGameOver && !didWin) {
        popupBody.innerHTML = `
        <h5 class="card-title">Game Over</h5>
    `;
    } else if (didWin) {
        popupBody.innerHTML = `        
        <h5 class="card-title">You Win!</h5>
    `;
    } else {
        popupBody.innerHTML = `
        <h5 class="card-title">Pause</h5>
        <div id="retryOption" class="menu-option">Resume</div>
    `;
    }
    popupBody.innerHTML += `
        <div class="menu-option"><a href="./space-invader.html">Retry</a></div>
    `;

    if (gameArray.length > 2) {
        popupBody.innerHTML += `
            <div class="menu-option"><a href="./index.html">Main Menu</a></div>
        `;
    }

    let selectedIndex = 0;
    const menuOptions = document.querySelectorAll('.menu-option');
    const retryOption = document.getElementById("retryOption");
    menuOptions[selectedIndex].classList.add('selected');

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !gameEndCheck) {
            isPaused = !isPaused;
            popup.style.display = isPaused ? "flex" : "none";
        }

        if (isPaused || isGameOver) {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                menuOptions[selectedIndex].classList.remove('selected');
                selectedIndex = (selectedIndex + 1) % menuOptions.length;
                menuOptions[selectedIndex].classList.add('selected');
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                menuOptions[selectedIndex].classList.remove('selected');
                selectedIndex = (selectedIndex - 1 + menuOptions.length) % menuOptions.length;
                menuOptions[selectedIndex].classList.add('selected');
            } else if (event.key === 'Enter') {
                if (menuOptions[selectedIndex] === retryOption) {
                    // Close popup if "Resume" is selected
                    popup.style.display = "none";
                    isPaused = false;
                } else {
                    // Redirect to the selected link
                    const link = menuOptions[selectedIndex].querySelector('a');
                    if (link) {
                        window.location.href = link.href;
                    }
                }
            }
        }
    });
}

drawPopup();
setInterval(game, 1000 / 60);
