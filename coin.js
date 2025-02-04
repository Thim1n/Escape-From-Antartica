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

function createCoins(canvas) {
    return [
        new Coin(200, canvas.height - 150),
        new Coin(400, canvas.height - 250),
        new Coin(600, canvas.height - 350),
        new Coin(850, canvas.height - 450),
        new Coin(1100, canvas.height - 550),
    ];
}
