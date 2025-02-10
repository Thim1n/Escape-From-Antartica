// Fichier Trigerzone.js
class TriggerSpike extends SpikeEnemy {
    constructor(x, y, width = 30, height = 30) {
        super(x, y, width, height);
        this.isAlive = true;
        this.isTriggered = false;
    }

    trigger() {
        this.isTriggered = true;
    }

    removeEnemy() {
        this.isAlive = false;
        const index = enemies.indexOf(this);
        if (index > -1) {
            enemies.splice(index, 1);
        }
    }

    reset() {
        this.isAlive = true;
        this.isTriggered = false;
    }
}

// Deuxième classe - TriggerZone
class TriggerZone {
    constructor(x, y, width, height, enemy) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.enemy = enemy;
        this.isTriggered = false;
        this.initialEnemyX = enemy ? enemy.x : null;
        this.initialEnemyY = enemy ? enemy.y : null;
    }

    checkTrigger(player) {
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
    
    draw(ctx) {
        ctx.strokeStyle = this.isTriggered ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 255, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Ligne pointillée
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.setLineDash([]); // Réinitialiser le style de ligne

        // Si l'ennemi existe et est en vie, le dessiner aussi
        if (this.enemy && this.enemy.isAlive) {
            this.enemy.draw(ctx);
        }
    }


    reset() {
        this.isTriggered = false;
        if (this.enemy) {
            // Réinitialiser la position de l'ennemi à sa position initiale
            this.enemy.x = this.initialEnemyX;
            this.enemy.y = this.initialEnemyY;
            this.enemy.isAlive = true;
        }
    }
}

// Fonction de création des zones
// Fonction de création des zones
function createTriggerZones(canvas) {
    if (!canvas) return []; // Guard clause if canvas is undefined
    
    return [
        // Première zone de déclenchement
        new TriggerZone(
            300, 
            canvas.height - 500, 
            300, 
            100,
            new TriggerEnemy(
                450,
                canvas.height - 460, 
                440, 
                550, 
                canvas.height - 460, 
                canvas.height - 460, 
                1
            )
        ),
        
        // Deuxième zone de déclenchement
        new TriggerZone(
            1200, 
            canvas.height - 600, 
            200, 
            20,
            new TriggerEnemy(
                1250, 
                canvas.height - 500, 
                1250, 
                1250, 
                canvas.height - 1600, 
                canvas.height - 500, 
                3
            )
        ),

        new TriggerZone(
            3200, 
            canvas.height - 215, 
            10, 
            150,
            new TriggerEnemy(
                3300, 
                canvas.height - 120, 
                2950, 
                3300, 
                canvas.height - 100, 
                canvas.height - 100, 
                1
            )
        ),

        // Troisième zone de déclenchement avec TriggerSpike
        /*new TriggerZone(
            2330, 
            canvas.height - 100, 
            400, 
            100,
            new TriggerSpike(2460, canvas.height - 100)  // Utilisation de TriggerSpike ici
        ),

        new TriggerZone(
            2330, 
            canvas.height - 100, 
            400, 
            100,
            new TriggerSpike(2490, canvas.height - 100)  // Utilisation de TriggerSpike ici
        ),

        new TriggerZone(
            2330, 
            canvas.height - 100, 
            400, 
            100,
            new TriggerSpike(2520, canvas.height - 100)  // Utilisation de TriggerSpike ici
        ),

        new TriggerZone(
            2330, 
            canvas.height - 100, 
            400, 
            100,
            new TriggerSpike(2550, canvas.height - 100)  // Utilisation de TriggerSpike ici
        ),

        new TriggerZone(
            2330, 
            canvas.height - 100, 
            400, 
            100,
            new TriggerSpike(2580, canvas.height - 100)  // Utilisation de TriggerSpike ici
        ),

        new TriggerZone(
            2330, 
            canvas.height - 100, 
            400, 
            100,
            new TriggerSpike(2610, canvas.height - 100)  // Utilisation de TriggerSpike ici
        ),*/
    ];
}
