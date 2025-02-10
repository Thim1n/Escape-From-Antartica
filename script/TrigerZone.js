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

    reset() {
        this.isTriggered = false;
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
                550,
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
            1000,
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
