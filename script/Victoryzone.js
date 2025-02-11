class VictoryZone {
    constructor(x, y, width = 50, height = 50, imageSrc = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isTriggered = false;

        // Charger l'image si une source d'image est fournie
        if (imageSrc) {
            this.image = new Image();
            this.image.onload = () => {
                console.log("Image chargée avec succès");
                this.imageLoaded = true;
            };
            this.image.onerror = () => {
                console.error("Erreur de chargement de l'image");
            };
            this.image.src = imageSrc;
        }
    }

    draw(ctx) {
        if (this.image) {
            // Dessiner l'image si elle est chargée
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Rectangle vert semi-transparent pour la visibilité pendant les tests
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

	checkVictory(player) {
		if (
			!this.isTriggered &&
			player.x < this.x + this.width &&
			player.x + player.width > this.x &&
			player.y < this.y + this.height &&
			player.y + player.height > this.y
		) {
			this.isTriggered = true;

			return true;
		}
		return false;
	}

	reset() {
		this.isTriggered = false;
	}
}
