import TileMap from "./TileMap.js";
import {loadSound} from "../../assetHandler";
import {getGameNames} from "../../FileHandler";

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("pacManCanvas");
const popup = document.getElementById("popup");
const popupBody = document.getElementById("popupBody");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

const gameArray = [...getGameNames()];

let gameOver = false;
let gameWin = false;
let isPaused = false;
let gameEndCheck = false;
let score = 0;
let highScore = localStorage.getItem("highScorePacMan") || 0;
let gameOverSound = null;
let gameWinSound = null;

const gameOverAsset = loadSound("gameOver.wav");
gameOverSound = gameOverAsset ? new Audio(gameOverAsset.src) : null;

const gameWinAsset = loadSound("gameWin.wav");
gameWinSound = gameWinAsset ? new Audio(gameWinAsset.src) : null;


highScoreDisplay.textContent = highScore;

function gameLoop() {
    tileMap.draw(ctx);
    drawGameEnd();
    pacman.draw(ctx, pause(), enemies);
    enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
    checkGameOver();
    checkGameWin();
    displayScore();
}

function checkGameWin() {
    if (!gameWin) {
        gameWin = tileMap.didWin();
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
    return enemies.some(
        (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
    );
}

function pause() {
    return !pacman.madeFirstMove || gameOver || gameWin || isPaused;
}

function drawGameEnd() {
    if (gameOver || gameWin) {
        let text = " You Win!";
        if (gameOver) {
            text = "Game Over";
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);

        ctx.font = "75px comic sans";
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        ctx.fillStyle = gradient;
        ctx.fillText(text, 10, canvas.height / 2);

        if (!gameEndCheck) {
            gameEndCheck = true;
            drawPopup();
            popup.style.display = "flex";
        }
    }
}

function displayScore() {
    score = pacman.getScore();
    scoreDisplay.textContent = score;

    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem("highScorePacMan", highScore);
    }
}

function drawPopup() {
    if (gameOver) {
        popupBody.innerHTML = `
        <h5 class="card-title">Game Over</h5>
    `;
    } else if (gameWin) {
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
        <div class="menu-option"><a href="./pacman.html">Retry</a></div>
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
        if (isPaused || gameOver || gameWin) {
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

tileMap.setCanvasSize(canvas);
drawPopup();
setInterval(gameLoop, 1000 / 75);
