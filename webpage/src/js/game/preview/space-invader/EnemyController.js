import MovingDirection from "./MovingDirection.js";
import {assetArray} from "../../gameData.js";
import {createEnemy} from "./Enemy.js";

let enemyDeathSound = null;

export function initializeEnemyController() {
    const enemyDeathAsset = assetArray.find(asset => asset.name === "enemy-death.wav");
    enemyDeathSound = new Audio(enemyDeathAsset.url);
}

export function resetEnemyController() {
    enemyDeathSound.pause();
    enemyDeathSound.currentTime = 0;
}

export function createEnemyController(canvas, enemyBulletController, playerBulletController) {
    const enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];
    let enemyRows = [];

    let currentDirection = MovingDirection.right;
    let xVelocity = 0;
    let yVelocity = 0;
    const defaultXVelocity = 1;
    const defaultYVelocity = 1;
    let moveDownTimerDefault = 30;
    let moveDownTimer = moveDownTimerDefault;
    let fireBulletTimerDefault = 100;
    let fireBulletTimer = fireBulletTimerDefault;

    function createEnemies() {
        enemyMap.forEach((row, rowIndex) => {
            enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    enemyRows[rowIndex].push(
                        createEnemy(enemyIndex * 50, rowIndex * 35, enemyNumber)
                    );
                }
            });
        });
    }

    createEnemies();

    return {
        enemyRows,
        draw(ctx, pause) {
            if (!pause) {
                this.decrementMoveDownTimer();
                this.updateVelocityAndDirection();
                this.collisionDetection();
            }

            this.drawEnemies(ctx, pause);

            if (!pause) {
                this.resetMoveDownTimer();
                this.fireBullet();
            }
        },

        collisionDetection() {
            enemyRows.forEach((enemyRow) => {
                enemyRow.forEach((enemy, enemyIndex) => {
                    if (playerBulletController.collideWith(enemy)) {
                        enemyDeathSound.play();
                        enemyRow.splice(enemyIndex, 1);
                    }
                });
            });

            enemyRows = enemyRows.filter((enemyRow) => enemyRow.length > 0);
        },

        fireBullet() {
            fireBulletTimer--;
            if (fireBulletTimer <= 0) {
                fireBulletTimer = fireBulletTimerDefault;
                const allEnemies = enemyRows.flat();
                const enemyIndex = Math.floor(Math.random() * allEnemies.length);
                const enemy = allEnemies[enemyIndex];
                enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
            }
        },

        resetMoveDownTimer() {
            if (moveDownTimer <= 0) {
                moveDownTimer = moveDownTimerDefault;
            }
        },

        decrementMoveDownTimer() {
            if (
                currentDirection === MovingDirection.downLeft ||
                currentDirection === MovingDirection.downRight
            ) {
                moveDownTimer--;
            }
        },

        updateVelocityAndDirection() {
            for (const enemyRow of enemyRows) {
                if (currentDirection == MovingDirection.right) {
                    xVelocity = defaultXVelocity;
                    yVelocity = 0;
                    const rightMostEnemy = enemyRow[enemyRow.length - 1];
                    if (rightMostEnemy.x + rightMostEnemy.width >= canvas.width) {
                        currentDirection = MovingDirection.downLeft;
                        break;
                    }
                } else if (currentDirection === MovingDirection.downLeft) {
                    if (this.moveDown(MovingDirection.left)) {
                        break;
                    }
                } else if (currentDirection === MovingDirection.left) {
                    xVelocity = -defaultXVelocity;
                    yVelocity = 0;
                    const leftMostEnemy = enemyRow[0];
                    if (leftMostEnemy.x <= 0) {
                        currentDirection = MovingDirection.downRight;
                        break;
                    }
                } else if (currentDirection === MovingDirection.downRight) {
                    if (this.moveDown(MovingDirection.right)) {
                        break;
                    }
                }
            }
        },

        moveDown(newDirection) {
            xVelocity = 0;
            yVelocity = defaultYVelocity;
            if (moveDownTimer <= 0) {
                currentDirection = newDirection;
                return true;
            }
            return false;
        },

        drawEnemies(ctx, pause) {
            enemyRows.flat().forEach((enemy) => {
                if (!pause) {
                    enemy.move(xVelocity, yVelocity);
                }
                enemy.draw(ctx);
            });
        },

        collideWith(sprite) {
            return enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
        }
    };
}
