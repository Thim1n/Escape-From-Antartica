class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.color = "blue";
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.4;
        this.isJumping = false;
        this.speed = 5;
        this.coins = 0;
        this.deathCount = 0;
        this.startX = x;
        this.startY = y;
    }

    update(platforms) {
        // Appliquer la gravité
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        let newX = this.x + this.velocityX;
        let canMoveHorizontally = true;
    
        for (let platform of platforms) {
            // Collision latérale, en ignorant les 10 pixels du bas du personnage
            if (
                newX < platform.x + platform.width &&
                newX + this.width > platform.x &&
                this.y < platform.y + platform.height &&
                this.y + this.height - 1 > platform.y // Ignorer les 10 pixels du bas
            ) {
                canMoveHorizontally = false;
                if (this.velocityX < 0) {
                    newX = platform.x + platform.width;
                } else if (this.velocityX > 0) {
                    newX = platform.x - this.width;
                }
            }

            // Collision verticale par le haut (le joueur atterrit sur une plateforme)
            if (
                this.y + this.height > platform.y && 
                this.y + this.height - this.velocityY <= platform.y && 
                this.x + this.width > platform.x && 
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }

            // Collision verticale par le bas (empêcher de traverser)
            if (
                this.y < platform.y + platform.height && 
                this.y - this.velocityY >= platform.y + platform.height &&
                this.x + this.width > platform.x && 
                this.x < platform.x + platform.width
            ) {
                this.y = platform.y + platform.height;
                this.velocityY = Math.abs(this.velocityY);
            }
        }

        if (canMoveHorizontally) {
            this.x = newX;
        } else {
            this.velocityX = 0;
        }

        // Empêcher de tomber sous le sol
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

    collectCoin() {
        this.coins++;
    }

    die() {
        this.deathCount++;
        this.x = this.startX;
        this.y = this.startY;
        this.velocityX = 0;
        this.velocityY = 0;
    }
}
