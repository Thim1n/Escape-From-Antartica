class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// ✅ Déclaration des plateformes EN DEHORS de la classe
function createPlatforms(canvas) {
    return [
        new Platform(0, canvas.height - 20, canvas.width, 20), // ✅ Sol pleine largeur
        new Platform(200, canvas.height - 100, 150, 10),
        new Platform(400, canvas.height - 200, 150, 10),
        new Platform(600, canvas.height - 300, 150, 10),
        new Platform(850, canvas.height - 400, 150, 10),
        new Platform(1100, canvas.height - 500, 150, 10),
    ];
}
