//Fichier platform.js
class Platform {
    constructor(x, y, width, height, type = "default", isPassableBelow = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.isPassableBelow = isPassableBelow;
    }

    draw(ctx) {
        switch(this.type) {
            case "ice_block":
                this.drawIceBlock(ctx);
                break;
            case "snow_ground":
                this.drawSnowGround(ctx);
                break;
            case "ice_cliff":
                this.drawIceCliff(ctx);
                break;
            default:
                this.drawDefault(ctx);
        }
    }

    drawDefault(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    drawIceBlock(ctx) {
        ctx.fillStyle = "rgba(200, 220, 255, 0.8)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        for (let i = 0; i < 3; i++) {
            let startX = this.x + Math.random() * this.width;
            let startY = this.y + Math.random() * this.height;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + 15, startY + 5);
            ctx.stroke();
        }

        ctx.strokeStyle = "rgba(150, 190, 255, 1)";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    drawSnowGround(ctx) {
        ctx.fillStyle = "rgb(240, 240, 255)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = "rgba(250, 250, 255, 0.7)";
        for (let i = 0; i < this.width / 10; i++) {
            let x = this.x + Math.random() * this.width;
            let y = this.y + Math.random() * this.height;
            let radius = Math.random() * 3 + 2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawIceCliff(ctx) {
        let gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, "rgb(200, 210, 220)");
        gradient.addColorStop(1, "rgb(170, 190, 210)");
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let x = this.x; x < this.x + this.width; x += 10) {
            ctx.lineTo(x, this.y + Math.random() * 5);
        }
        ctx.lineTo(this.x + this.width, this.y);
        ctx.closePath();
        ctx.fill();
    }
}

class DisappearingPlatform extends Platform {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.isVisible = true;
        this.disappearTimer = null;
        this.reappearDelay = 3000; // 3 secondes avant de réapparaître
    }

    draw(ctx) {
        if (this.isVisible) {
            ctx.fillStyle = "rgba(255, 165, 0, 0.8)"; // Orange semi-transparent
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    handleCollision(player) {
        if (!this.isVisible) return false;

        if (player.y + player.height === this.y) {
            if (this.disappearTimer === null) {
                this.disappearTimer = setTimeout(() => {
                    this.isVisible = false;

                    setTimeout(() => {
                        this.isVisible = true;
                        this.disappearTimer = null;
                    }, this.reappearDelay);
                }, 200); // Disparaît 200ms après que le joueur marche dessus
            }
            return true;
        }
        return false;
    }

    reset() {
        this.isVisible = true;
        if (this.disappearTimer) {
            clearTimeout(this.disappearTimer);
            this.disappearTimer = null;
        }
    }
}

class Door extends Platform {
    constructor(x, y, width = 40, height = 80) {
        super(x, y, width, height);
        this.isOpen = false;
        this.color = "brown";
        this.isCheckpoint = false; // Nouvelle propriété pour savoir si cette porte est le checkpoint actuel
    }

    draw(ctx) {
        ctx.fillStyle = this.isOpen ? "green" : this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.isCheckpoint) {
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y - 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    open(player) {
        if (player && player.clées > 0 && !this.isOpen) {
            this.isOpen = true;
            player.clées--;
            this.setAsCheckpoint(player);
        }
    }

    setAsCheckpoint(player) {
        if (window.doors) {
            window.doors.forEach(door => {
                door.isCheckpoint = false;
            });
        }

        this.isCheckpoint = true;
        player.setSpawnPoint(this.x + this.width + 10, this.y + this.height - player.height);
    }
}

function createPlatforms(canvas) {
    return [
        new Platform(0, canvas.height - 20, 816 , 20, "snow_ground"),
        new Platform(1350, canvas.height - 20, 5000 , 20, "snow_ground"),
        new Platform(150, canvas.height - 120, 100, 10, "ice_block", true),
        new Platform(300, canvas.height - 220, 100, 10, "ice_block"),
        new Platform(450, canvas.height - 300, 100, 10, "ice_block"),
        new Platform(450, canvas.height - 400, 100, 10, "ice_block"),
        new Platform(450, canvas.height - 500, 100, 10, "ice_block"),
        new Platform(600, canvas.height - 600, 100, 10, "ice_block"),
        new Platform(750, canvas.height - 600, 100, 10, "ice_block"),
        new Platform(1150, canvas.height - 600, 100, 10, "ice_block"),
        new Platform(1300, canvas.height - 600, 100, 10, "ice_block"),
        new Platform(615, canvas.height - 550, 200, 530, "ice_cliff"),
        new Platform(1420, canvas.height - 850, 200, 750, "ice_cliff"),
        new Platform(1420, canvas.height - 100, 200, 10, "ice_block"),
        new DisappearingPlatform(250, canvas.height - 420, 100, 10),
        new Platform(1750, canvas.height - 70, 300, 50, "ice_cliff"),
        new Platform(2100, canvas.height - 70, 600, 50, "ice_cliff"),
        new Platform(2350, canvas.height - 180, 100, 10, "ice_block"),
        new Platform(2750, canvas.height - 70, 600, 50, "ice_cliff"),
        new Platform(3500, canvas.height - 400, 50, 380, "ice_cliff"),
        new Platform(1750, canvas.height - 400, 1800, 50, "ice_cliff"),
    ];
}

function createDoors(canvas) {
    return [
        new Door(1450, canvas.height - 100),
    ];
}
