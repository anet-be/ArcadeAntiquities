import MovingDirection from "./MovingDirection.js";
import {assetArray} from "../../gameData.js";
import {didCollideWithEnvironment} from "./TileMap.js";
import {pacmanX, pacmanY, powerDotAboutToExpire, powerDotActive} from "./Pacman.js";

let scaredAboutToExpireTimer = 10;

let normalGhost = null;
let scaredGhost = null;
let scaredGhost2 = null;

let directionTimerDefault = null
let image = null;

export function restEnemy(){
    normalGhost = null;
    scaredGhost = null;
    scaredGhost2 = null;
    directionTimerDefault = null;
    image = null;
}
export function createEnemy(incomingX, incomingY, incomingTileSize, incomingVelocity, incomingTileMap) {
    const normalGhostImage = assetArray.find((asset) => asset.name === "ghost.png");
    const scaredGhostImage = assetArray.find((asset) => asset.name === "scaredGhost.png");
    const scaredGhost2Image = assetArray.find((asset) => asset.name === "scaredGhost2.png");

    normalGhost = new Image();
    normalGhost.src = normalGhostImage.url;

    scaredGhost = new Image();
    scaredGhost.src = scaredGhostImage.url;

    scaredGhost2 = new Image();
    scaredGhost2.src = scaredGhost2Image.url;

    directionTimerDefault = random(10, 25);
    return {
        x: incomingX,
        y: incomingY,
        tileSize: incomingTileSize,
        velocity: incomingVelocity,
        tileMap: incomingTileMap,
        movingDirection: Math.floor(Math.random() * Object.keys(MovingDirection).length),
        directionTimer: directionTimerDefault,
    };
}

export function collideWith(enemy) {
    const size = enemy.tileSize / 2;
    return (
        enemy.x < pacmanX + size &&
        enemy.x + size > pacmanX &&
        enemy.y < pacmanY + size &&
        enemy.y + size > pacmanY
    );
}

export function drawEnemy(ctx, pause, enemy) {
    if (!pause) {
        move(enemy);
        changeDirection(enemy);
    }
    setImage(ctx, enemy);
}

function setImage(ctx, enemy) {
    if (powerDotActive) {
        setImageWhenPowerDotIsActive(enemy);
    } else {
        image = normalGhost;
    }
    ctx.drawImage(image, enemy.x, enemy.y, enemy.tileSize, enemy.tileSize);
}

function setImageWhenPowerDotIsActive(enemy) {
    if (powerDotAboutToExpire) {
        scaredAboutToExpireTimer--;
        if (scaredAboutToExpireTimer === 0) {
            scaredAboutToExpireTimer = 10;
            image = (image === scaredGhost) ? scaredGhost2 : scaredGhost;
        }
    } else {
        image = scaredGhost;
    }
}

function changeDirection(enemy) {
    enemy.directionTimer--;
    let newMoveDirection = null;
    if (enemy.directionTimer === 0) {
        enemy.directionTimer = directionTimerDefault;
        newMoveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);
    }

    if (newMoveDirection != null && enemy.movingDirection !== newMoveDirection) {
        if (
            Number.isInteger(enemy.x / enemy.tileSize) &&
            Number.isInteger(enemy.y / enemy.tileSize)
        ) {
            if (!didCollideWithEnvironment(enemy.x, enemy.y, newMoveDirection)) {
                enemy.movingDirection = newMoveDirection;
            }
        }
    }
}

function move(enemy) {
    if (!didCollideWithEnvironment(enemy.x, enemy.y, enemy.movingDirection)) {
        switch (enemy.movingDirection) {
            case MovingDirection.up:
                enemy.y -= enemy.velocity;
                break;
            case MovingDirection.down:
                enemy.y += enemy.velocity;
                break;
            case MovingDirection.left:
                enemy.x -= enemy.velocity;
                break;
            case MovingDirection.right:
                enemy.x += enemy.velocity;
                break;
        }
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}