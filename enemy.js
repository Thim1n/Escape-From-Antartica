class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.speed = 2;
        this.direction = -1;
    }

    update() {
        this.x += this.speed * this.direction;
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.direction *= -1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        if (this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y) {
            player.die();
        }
    }
}
    function createPlatforms(canvas) {
        let platforms = [];
        // Plateforme de sol : occupe toute la largeur du canvas
        platforms.push(new Platform(0, canvas.height - 20, canvas.width, 20));
    
        // Plateformes intermédiaires pour créer un parcours
        platforms.push(new Platform(150, canvas.height - 120, 100, 10));
        platforms.push(new Platform(300, canvas.height - 220, 100, 10));
        platforms.push(new Platform(450, canvas.height - 300, 100, 10));
        platforms.push(new Platform(450, canvas.height - 400, 100, 10));
        platforms.push(new Platform(450, canvas.height - 500, 100, 10));
        platforms.push(new Platform(600, canvas.height - 600, 100, 10));
        platforms.push(new Platform(750, canvas.height - 600, 100, 10));
    
        // Plateforme objectif : en fin de niveau, vers la droite
        platforms.push(new Platform(canvas.width - 150, canvas.height - 80, 100, 10));
    
        return platforms;}
    

