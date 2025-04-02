import {loadImage} from "../../assetHandler.js"

export default class Enemy {
  constructor(x, y, imageNumber) {
    this.x = x;
    this.y = y;
    this.width = 44;
    this.height = 32;

    this.value = imageNumber;
    this.imageName = `enemy${imageNumber}`;
    const imageEnemyAsset = loadImage(this.imageName);
    this.imageEnemy = new Image();
    this.imageEnemy.src = imageEnemyAsset;
  }

  draw(ctx) {
      ctx.drawImage(this.imageEnemy, this.x, this.y, this.width, this.height);

  }

  move(xVelocity, yVelocity) {
    this.x += xVelocity;
    this.y += yVelocity;
  }

  collideWith(sprite) {
    if (
      this.x + this.width > sprite.x &&
      this.x < sprite.x + sprite.width &&
      this.y + this.height > sprite.y &&
      this.y < sprite.y + sprite.height
    ) {
      return true;
    } else {
      return false;
    }
  }

  getValue(){
    return this.value;
  }
}
