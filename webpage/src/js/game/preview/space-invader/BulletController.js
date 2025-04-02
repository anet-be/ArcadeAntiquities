import {createBullet} from "./Bullet.js";
import {assetArray} from "../../gameData.js";

let shootSound = null;

export function initializeBulletController() {
    const shootSoundAsset = assetArray.find((asset) => asset.name === "shoot.wav");
    shootSound = new Audio(shootSoundAsset.url);
}

export function resetBulletController() {
    shootSound.pause();
    shootSound.currentTime = 0;
}

export function createBulletController(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
    const bullets = [];
    let timeTillNextBulletAllowed = 0;

    return {
        draw(ctx, pause) {
            bullets.filter((bullet) => bullet.y + bullet.width > 0 && bullet.y <= canvas.height)
                .forEach((bullet) => bullet.draw(ctx, pause));

            if (timeTillNextBulletAllowed > 0) {
                timeTillNextBulletAllowed--;
            }
        },

        collideWith(sprite) {
            const bulletThatHitSpriteIndex = bullets.findIndex((bullet) =>
                bullet.collideWith(sprite)
            );

            if (bulletThatHitSpriteIndex >= 0) {
                bullets.splice(bulletThatHitSpriteIndex, 1);
                return true;
            }
            return false;
        },

        shoot(x, y, velocity, time = 0) {
            if (
                timeTillNextBulletAllowed <= 0 &&
                bullets.length < maxBulletsAtATime
            ) {
                const bullet = createBullet(canvas, x, y, velocity, bulletColor);
                bullets.push(bullet);
                if (soundEnabled) {
                    shootSound.play();
                }
                timeTillNextBulletAllowed = time;
            }
        }
    };
}
