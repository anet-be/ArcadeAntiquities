import Bullet from "./Bullet.js";
import {loadSound} from "../../assetHandler";

export default class BulletController {
  bullets = [];
  timeTillNextBulletAllowed = 0;

  constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
    this.canvas = canvas;
    this.maxBulletsAtATime = maxBulletsAtATime;
    this.bulletColor = bulletColor;
    this.soundEnabled = soundEnabled;

    this.shootSound = loadSound("shoot.wav");
  }

  draw(ctx, pause) {
    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );

    this.bullets.forEach((bullet) => bullet.draw(ctx, pause));
    if (this.timeTillNextBulletAllowed > 0) {
      this.timeTillNextBulletAllowed--;
    }
  }

  collideWith(sprite) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }

    return false;
  }

  shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
    if (
      this.timeTillNextBulletAllowed <= 0 &&
      this.bullets.length < this.maxBulletsAtATime
    ) {
      const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      if (this.soundEnabled) {
        this.shootSound.play();
      }
      this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }
}
