import {assetArray} from "../../gameData.js";

let enemies = [];
let enemy1Asset = null;
let enemy2Asset = null;
let enemy3Asset = null;

export function initializeEnemy() {
    enemy1Asset = assetArray.find((asset) => asset.name === "enemy1.png");
    enemy2Asset = assetArray.find((asset) => asset.name === "enemy2.png");
    enemy3Asset = assetArray.find((asset) => asset.name === "enemy3.png");
}

export function createEnemy(x, y, imageNumber) {
    const image = new Image();

    switch (imageNumber) {
        case 1:
            image.src = enemy1Asset?.url || "";
            break;
        case 2:
            image.src = enemy2Asset?.url || "";
            break;
        case 3:
            image.src = enemy3Asset?.url || "";
            break;
    }

    return {
        x,
        y,
        width: 44,
        height: 32,
        imageEnemy: image,

        draw(ctx) {
            ctx.drawImage(this.imageEnemy, this.x, this.y, this.width, this.height);
        },
        move(xVelocity, yVelocity) {
            this.x += xVelocity;
            this.y += yVelocity;
        },
        collideWith(sprite) {
            return this.x + this.width > sprite.x &&
                this.x < sprite.x + sprite.width &&
                this.y + this.height > sprite.y &&
                this.y < sprite.y + sprite.height;
        }
    };
}
