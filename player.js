class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.color = "blue";
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.5;
        this.isJumping = false;
        this.speed = 5;
    }

    update(platforms) {
        // 📌 Appliquer la gravité
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        let newX = this.x + this.velocityX;

        // 📌 Empêcher de sortir de l'écran
        if (newX >= 0 && newX + this.width <= window.innerWidth) {
            this.x = newX;
        } else {
            this.velocityX = 0;
        }

        // 📌 Gestion des collisions avec les plateformes
        for (let platform of platforms) {
            // ✅ Collision par le haut (le joueur atterrit sur une plateforme)
            if (
                this.y + this.height > platform.y && 
                this.y + this.height - this.velocityY <= platform.y && 
                this.x + this.width > platform.x && 
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false; // ✅ Permet de sauter à nouveau
            }

            // ✅ Collision par le bas (empêcher de traverser)
            if (
                this.y < platform.y + platform.height && 
                this.y - this.velocityY >= platform.y + platform.height &&
                this.x + this.width > platform.x && 
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y + platform.height;
                this.velocityY = Math.abs(this.velocityY); // ✅ Repousse vers le bas
            }
        }

        // 📌 Empêcher de tomber sous le sol
        if (this.y + this.height >= window.innerHeight) {
            this.y = window.innerHeight - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = -10;
            this.isJumping = true;
        }
    }

    moveLeft() {
        this.velocityX = -this.speed;
    }

    moveRight() {
        this.velocityX = this.speed;
    }

    stop() {
        this.velocityX = 0;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
