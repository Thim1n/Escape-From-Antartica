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
        new Coin(650, canvas.height - 650),
        new Coin(1050, canvas.height - 725),
    ];
}


class Clée extends Coin {
    constructor(x, y) {
        super(x, y);
        this.color = "green"; 
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

    }
}

class PowerUp extends Coin {
    constructor(x, y) {
        super(x, y);
        this.color = "pink"; 
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

    }
}


function createClées(canvas) {
    return [
        new Clée(300, canvas.height - 50),
        new PowerUp(3900, canvas.height - 50),

    ];
}

