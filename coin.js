class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
    }

    draw(ctx) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
