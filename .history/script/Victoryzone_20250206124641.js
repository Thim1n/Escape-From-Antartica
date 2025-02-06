// Fichier VictoryZone.js
class VictoryZone {
    constructor(x, y, width = 50, height = 50) {
        this.x = 8000;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isTriggered = false;
    }

    draw(ctx) {
        // Rectangle vert semi-transparent pour la visibilité pendant les tests
        ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkVictory(player) {
        if (!this.isTriggered &&
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y) {
            this.isTriggered = true;
            
            return true;
        }
        return false;
    }

    reset() {
        this.isTriggered = false;
    }
}