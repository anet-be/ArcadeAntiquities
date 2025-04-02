import MovingDirection from "./MovingDirection.js";
import {assetArray} from "../../gameData.js";
import {didCollideWithEnvironment, eatDotTileMap, eatPowerDotTileMap} from "./TileMap.js";
import {collideWith,} from "./Enemy.js";

export let pacmanX = null;
export let pacmanY = null;
let pacmanTileSize = null;
let pacmanVelocity = null;
let tileMap = null;

let pacmanImageIndex = 0;

let currentMovingDirection = null;
let requestedMovingDirection = null;
let pacmanAnimationTimerDefault = 10;
let pacmanAnimationTimer = null;
let pacmanRotation = 0;

let wakaSound = null;
let eatGhostSound = null;

let powerDotSound = null;
export let powerDotActive = false;
export let powerDotAboutToExpire = false;

export let madeFirstMove = true;
let pacmanImages = [];
let timers = [];

const rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
};

export function resetPacman() {
    currentMovingDirection = null;
    requestedMovingDirection = null;
    pacmanAnimationTimer = null;
    pacmanRotation = 0;
    pacmanImageIndex = 0;
    powerDotActive = false;
    powerDotAboutToExpire = false;
    madeFirstMove = false;
    timers = [];
}

export function createPacman(incomingX, incomingY, incomingTileSize, incomingVelocity, incomingTileMap) {
    const wakaSoundAsset = assetArray.find((asset) => asset.name === "waka.wav");
    const powerDotSoundAsset = assetArray.find((asset) => asset.name === "power_dot.wav");
    const eatGhostSoundAsset = assetArray.find((asset) => asset.name === "eat_ghost.wav");

    pacmanX = incomingX;
    pacmanY = incomingY;
    pacmanTileSize = incomingTileSize;
    pacmanVelocity = incomingVelocity;
    tileMap = incomingTileMap;

    pacmanAnimationTimerDefault = 10;
    pacmanRotation = 0;
    pacmanImageIndex = 0;
    powerDotActive = false;
    powerDotAboutToExpire = false;
    madeFirstMove = false;

    wakaSound = new Audio(wakaSoundAsset.url);
    powerDotSound = new Audio(powerDotSoundAsset.url);
    eatGhostSound = new Audio(eatGhostSoundAsset.url);

    document.addEventListener("keydown", keydown);

    loadPacmanImages();

    return {
        madeFirstMove,
        powerDotActive,
        powerDotAboutToExpire,
    };
}

export function drawPacMan(ctx, pause, enemies) {
    if (!pause) {
        move();
        animate();
    }

    eatDot();
    eatPowerDot();
    eatGhost(enemies);
    const size = pacmanTileSize / 2;

    ctx.save();
    ctx.translate(pacmanX + size, pacmanY + size);
    ctx.rotate((pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(pacmanImages[pacmanImageIndex], -size, -size, pacmanTileSize, pacmanTileSize);
    ctx.restore();
}

function loadPacmanImages() {
    const pacmanAsset1 = assetArray.find((asset) => asset.name === "pac1.png");
    const pacmanAsset2 = assetArray.find((asset) => asset.name === "pac2.png");
    const pacmanAsset3 = assetArray.find((asset) => asset.name === "pac1.png");
    const pacmanAsset4 = assetArray.find((asset) => asset.name === "pac2.png");

    pacmanImages = [
        new Image(),
        new Image(),
        new Image(),
        new Image()
    ];

    pacmanImages[0].src = pacmanAsset1.url;
    pacmanImages[1].src = pacmanAsset2.url;
    pacmanImages[2].src = pacmanAsset3.url;
    pacmanImages[3].src = pacmanAsset4.url;
}

function keydown(event) {
    if (event.keyCode == 38) {
        if (currentMovingDirection == MovingDirection.down)
            currentMovingDirection = MovingDirection.up;
        requestedMovingDirection = MovingDirection.up;
        madeFirstMove = true;
    }
    if (event.keyCode == 40) {
        if (currentMovingDirection == MovingDirection.up)
            currentMovingDirection = MovingDirection.down;
        requestedMovingDirection = MovingDirection.down;
        madeFirstMove = true;
    }
    if (event.keyCode == 37) {
        if (currentMovingDirection == MovingDirection.right)
            currentMovingDirection = MovingDirection.left;
        requestedMovingDirection = MovingDirection.left;
        madeFirstMove = true;
    }
    if (event.keyCode == 39) {
        if (currentMovingDirection == MovingDirection.left)
            currentMovingDirection = MovingDirection.right;
        requestedMovingDirection = MovingDirection.right;
        madeFirstMove = true;
    }
}



function move() {
    if (currentMovingDirection !== requestedMovingDirection) {
        if (
            Number.isInteger(pacmanX / pacmanTileSize) &&
            Number.isInteger(pacmanY / pacmanTileSize)
        ) {
            if (
                !didCollideWithEnvironment(
                    pacmanX,
                    pacmanY,
                    requestedMovingDirection
                )
            )
               currentMovingDirection = requestedMovingDirection;
        }
    }

    if (
        didCollideWithEnvironment(
            pacmanX,
            pacmanY,
            currentMovingDirection
        )
    ) {
       pacmanAnimationTimer = null;
        pacmanImageIndex = 1;
        return;
    } else if (
        currentMovingDirection != null &&
        pacmanAnimationTimer == null
    ) {
        pacmanAnimationTimer = pacmanAnimationTimerDefault;
    }

    switch (currentMovingDirection) {
        case MovingDirection.up:
            pacmanY -= pacmanVelocity;
            pacmanRotation = rotation.up;
            break;
        case MovingDirection.down:
            pacmanY += pacmanVelocity;
           pacmanRotation = rotation.down;
            break;
        case MovingDirection.left:
            pacmanX -= pacmanVelocity;
            pacmanRotation = rotation.left;
            break;
        case MovingDirection.right:
           pacmanX += pacmanVelocity;
            pacmanRotation = rotation.right;
            break;
    }
}

function animate() {
    pacmanAnimationTimer--;
    if (pacmanAnimationTimer <= 0) {
        pacmanImageIndex = pacmanImageIndex === 0 ? 1 : 0;
        pacmanRotation = pacmanRotation === 0 ? 1 : 0;
        pacmanAnimationTimer = pacmanAnimationTimerDefault;
    }
}

function eatDot() {
    if (madeFirstMove && eatDotTileMap(pacmanX, pacmanY)) {
        wakaSound.play();
    }
}

function eatPowerDot() {
    if (eatPowerDotTileMap(pacmanX, pacmanY)) {
        powerDotSound.play();
        powerDotActive = true;
        powerDotAboutToExpire = false;
        timers.forEach((timer) => clearTimeout(timer));
        timers = [];

        let powerDotTimer = setTimeout(() => {
            powerDotActive = false;
            powerDotAboutToExpire = false;
        }, 1000 * 6);

        timers.push(powerDotTimer);

        let powerDotAboutToExpireTimer = setTimeout(() => {
            powerDotAboutToExpire = true;
        }, 1000 * 3);

        timers.push(powerDotAboutToExpireTimer);
    }
}

function eatGhost(enemies) {
    if (powerDotActive) {
        const collideEnemies = enemies.filter((enemy) => collideWith(enemy));
        collideEnemies.forEach((enemy) => {
            enemies.splice(enemies.indexOf(enemy), 1);
            eatGhostSound.play();
        });
    }
}