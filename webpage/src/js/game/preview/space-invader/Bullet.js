export function createBullet(canvas, x, y, velocity, bulletColor) {
    return {
        canvas,
        x,
        y,
        velocity,
        bulletColor,
        width: 5,
        height: 20,

        draw(ctx, pause) {
            if (!pause) {
                this.y -= this.velocity;
            }
            ctx.fillStyle = this.bulletColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },

        collideWith(sprite) {
            if (
                this.x + this.width > sprite.x &&
                this.x < sprite.x + sprite.width &&
                this.y + this.height > sprite.y &&
                this.y < sprite.y + sprite.height
            ) {
                return true;
            }
            return false;
        }
    };
}
