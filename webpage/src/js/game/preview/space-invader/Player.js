import {assetArray} from "../../gameData.js";

let imagePlayer = null;

export function initializePlayer() {
    const imagePlayerAsset = assetArray.find(asset => asset.name === "player.png");
    imagePlayer = new Image();
    imagePlayer.src = imagePlayerAsset.url;
}

export function resetPlayer() {
    imagePlayer = null;
}

export function createPlayer(canvas, velocity, bulletController) {
    const player = {
        rightPressed: false,
        leftPressed: false,
        shootPressed: false,
        x: canvas.width / 2,
        y: canvas.height - 75,
        width: 50,
        height: 48,

        draw(ctx, pause) {
            if (!pause) {
                if (this.shootPressed) {
                    bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
                }
                this.move();
                this.collideWithWalls();
            }

            ctx.drawImage(imagePlayer, this.x, this.y, this.width, this.height);
        },

        collideWithWalls() {
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x > canvas.width - this.width) {
                this.x = canvas.width - this.width;
            }
        },

        move() {
            if (this.rightPressed) {
                this.x += velocity;
            } else if (this.leftPressed) {
                this.x -= velocity;
            }
        },

        keydown(event) {
            if (event.code === "ArrowRight") {
                this.rightPressed = true;
            }
            if (event.code === "ArrowLeft") {
                this.leftPressed = true;
            }
            if (event.code === "Space") {
                this.shootPressed = true;
            }
        },

        keyup(event) {
            if (event.code === "ArrowRight") {
                this.rightPressed = false;
            }
            if (event.code === "ArrowLeft") {
                this.leftPressed = false;
            }
            if (event.code === "Space") {
                this.shootPressed = false;
            }
        }
    };

    document.addEventListener("keydown", player.keydown.bind(player));
    document.addEventListener("keyup", player.keyup.bind(player));

    return player;
}
