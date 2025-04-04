import MovingDirection from "./MovingDirection.js";
import {assetArray} from "../../gameData.js";
import {createEnemy} from "./Enemy.js";
import {createPacman} from "./Pacman.js";

let tileSize = null;
let yellowDot = null;
let pinkDot = null;
let wall = null;
let powerDot = null;

let powerDotAnmationTimerDefault = 30;
let powerDotAnmationTimer = null;

let map = null;

export function resetTileMap() {
    tileSize = null;
    yellowDot = null;
    pinkDot = null;
    wall = null;
    powerDot = null;
    powerDotAnmationTimer = null;
    powerDotAnmationTimerDefault = null;
}

export function createTileMap(incomingTileSize) {
  const yellowDotAsset = assetArray.find((asset) => asset.name === "yellowDot.png");
  const pinkDotAsset = assetArray.find((asset) => asset.name === "pinkDot.png");
  const wallAsset = assetArray.find((asset) => asset.name === "wall.png");

  yellowDot = new Image();
  yellowDot.src = yellowDotAsset.url;

  pinkDot = new Image();
  pinkDot.src = pinkDotAsset.url;

  wall = new Image();
  wall.src = wallAsset.url;

  tileSize = incomingTileSize;
  powerDot = pinkDot;
  powerDotAnmationTimerDefault = 30;
  powerDotAnmationTimer = powerDotAnmationTimerDefault;

  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  return {
    setCanvasSize,
    didWin,
  };
}

export function drawTileMap(ctx) {
  for (let row = 0; row < map.length; row++) {
    for (let column = 0; column < map[row].length; column++) {
      const tile = map[row][column];
      if (tile === 1) {
        drawWall(ctx, column, row, tileSize);
      } else if (tile === 0) {
        drawDot(ctx, column, row, tileSize);
      } else if (tile == 7) {
        drawPowerDot(ctx, column, row, tileSize);
      } else {
        drawBlank(ctx, column, row, tileSize);
      }
    }
  }
}

export function drawDot(ctx, column, row, size) {
  ctx.drawImage(yellowDot, column * tileSize, row * tileSize, size, size);
}

export function drawPowerDot(ctx, column, row, size) {
  powerDotAnmationTimer--;
  if (powerDotAnmationTimer === 0) {
    powerDotAnmationTimer = powerDotAnmationTimerDefault;
    powerDot = (powerDot === pinkDot) ? yellowDot : pinkDot;
  }
  ctx.drawImage(powerDot, column * size, row * size, size, size);
}

export function drawWall(ctx, column, row, size) {
  ctx.drawImage(wall, column * tileSize, row * tileSize, size, size);
}

export function drawBlank(ctx, column, row, size) {
  ctx.fillStyle = "black";
  ctx.fillRect(column * tileSize, row * tileSize, size, size);
}

export function setCanvasSize(canvas) {
  canvas.width = map[0].length * tileSize;
  canvas.height = map.length * tileSize;
}

export function didWin() {
  return dotsLeft() === 0;
}

export function dotsLeft() {
  return map.flat().filter((tile) => tile === 0).length;
}

export function eatDotTileMap(x, y) {
  const row = y / tileSize;
  const column = x / tileSize;
  if (Number.isInteger(row) && Number.isInteger(column)) {
    if (map[row][column] === 0) {
      map[row][column] = 5;
      return true;
    }
  }
  return false;
}

export function eatPowerDotTileMap(x, y) {
  const row = y / tileSize;
  const column = x / tileSize;
  if (Number.isInteger(row) && Number.isInteger(column)) {
    const tile = map[row][column];
    if (tile === 7) {
      map[row][column] = 5;
      return true;
    }
  }
  return false;
}

export function didCollideWithEnvironment(x, y, direction) {
  if (direction == null) return false;

  if (
      Number.isInteger(x / tileSize) &&
      Number.isInteger(y / tileSize)
  ) {
    let column = 0;
    let row = 0;
    let nextColumn = 0;
    let nextRow = 0;

    switch (direction) {
      case MovingDirection.right:
        nextColumn = x + tileSize;
        column = nextColumn / tileSize;
        row = y / tileSize;
        break;
      case MovingDirection.left:
        nextColumn = x - tileSize;
        column = nextColumn / tileSize;
        row = y / tileSize;
        break;
      case MovingDirection.up:
        nextRow = y - tileSize;
        row = nextRow / tileSize;
        column = x / tileSize;
        break;
      case MovingDirection.down:
        nextRow = y + tileSize;
        row = nextRow / tileSize;
        column = x / tileSize;
        break;
    }
    const tile = map[row][column];
    if (tile === 1) return true;
  }
  return false;
}

export function getPacman(velocity) {
  for (let row = 0; row < map.length; row++) {
    for (let column = 0; column < map[row].length; column++) {
      const tile = map[row][column];
      if (tile === 4) {
        map[row][column] = 0;
        return createPacman(column * tileSize, row * tileSize, tileSize, velocity, map);
      }
    }
  }
}

export function getEnemies(velocity) {
  const enemies = [];

  for (let row = 0; row < map.length; row++) {
    for (let column = 0; column < map[row].length; column++) {
      const tile = map[row][column];
      if (tile === 6) {
        map[row][column] = 0;
        enemies.push(createEnemy(column * tileSize, row * tileSize, tileSize, velocity, map));
      }
    }
  }
  return enemies;
}