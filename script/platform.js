//Fichier platform.js
class Platform {
	constructor(
		x,
		y,
		width,
		height,
		type = "default",
		isPassableBelow = false
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.type = type;
		this.isPassableBelow = isPassableBelow;
	}

	draw(ctx) {
		switch (this.type) {
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
		/*
        // Texture de neige
        ctx.fillStyle = "rgba(250, 250, 255, 0.7)";
        for (let i = 0; i < this.width / 10; i++) {
            let x = this.x + Math.random() * this.width;
            let y = this.y + Math.random() * this.height;
            let radius = Math.random() * 3 + 2;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }*/
	}

	drawIceCliff(ctx) {
		// Dégradé bleu clair inspiré de l'image
		let gradient = ctx.createLinearGradient(
			this.x,
			this.y,
			this.x,
			this.y + this.height
		);
		gradient.addColorStop(0, "rgb(140, 200, 255)"); // Bleu clair en haut
		gradient.addColorStop(1, "rgb(100, 180, 255)"); // Bleu légèrement plus foncé en bas
		ctx.fillStyle = gradient;
		ctx.fillRect(this.x, this.y, this.width, this.height);

		// Effet de stries nettes dans la glace
		ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // Blanc semi-transparent
		ctx.lineWidth = 3;
		ctx.beginPath();

		ctx.stroke();
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
class Bouncer extends Platform {
	constructor(x, y, width, height) {
		super(x, y, width, height);
		this.bounceForce = 20; // Force de rebond plus importante
	}

	draw(ctx) {
		// Style visuel du bouncer
		ctx.fillStyle = "rgb(255, 87, 51)"; // Orange-rouge
		ctx.fillRect(this.x, this.y, this.width, this.height);

		// Effet visuel (ressort)
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.lineWidth = 2;
		for (let i = 0; i < this.width; i += 10) {
			ctx.moveTo(this.x + i, this.y);
			ctx.lineTo(this.x + i + 5, this.y + this.height);
		}
		ctx.stroke();
	}

	handleCollision(player) {
		if (
			player.velocityY > 0 && // Le joueur descend
			player.y + player.height >= this.y &&
			player.y + player.height <= this.y + this.height &&
			player.x + player.width > this.x &&
			player.x < this.x + this.width
		) {
			player.velocityY = this.bounceForce;
			player.isJumping = true;
			return true;
		}
		return false;
	}
}

class Door extends Platform {
	constructor(x, y, width = 40, height = 80) {
		super(x, y, width, height);
		this.isOpen = false;
		this.isCheckpoint = false;

		// Modifier les chemins des images
		this.closedImage = new Image();
		this.closedImage.src = "../assets/sprite/porte_femer.png"; // Enlever un point

		this.openImage = new Image();
		this.openImage.src = "../assets/sprite/porte_ouvert.png"; // Enlever un point

		// Ajouter des gestionnaires d'erreur pour déboguer
		this.closedImage.onerror = () => {
			console.error(
				"Erreur de chargement de l'image porte fermée:",
				this.closedImage.src
			);
		};

		this.openImage.onerror = () => {
			console.error(
				"Erreur de chargement de l'image porte ouverte:",
				this.openImage.src
			);
		};
	}

	draw(ctx) {
		// Dessiner la porte
		const imageToDraw = this.isOpen ? this.openImage : this.closedImage;
		ctx.drawImage(imageToDraw, this.x, this.y, this.width, this.height);

		// Indiquer visuellement si c'est un checkpoint
		if (this.isCheckpoint) {
			ctx.fillStyle = "yellow";
			ctx.beginPath();
			ctx.arc(this.x + this.width / 2, this.y - 10, 5, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	// Les autres méthodes restent inchangées
	open(player) {
		if (player && player.clées > 0 && !this.isOpen) {
			this.isOpen = true;
			player.clées--;
			this.setAsCheckpoint(player);
		}
	}

	setAsCheckpoint(player) {
		if (window.doors) {
			window.doors.forEach((door) => {
				door.isCheckpoint = false;
			});
		}

		// Définir cette porte comme nouveau checkpoint
		this.isCheckpoint = true;

		// Mettre à jour le point de spawn du joueur
		player.setSpawnPoint(
			this.x + this.width + 10,
			this.y + this.height - player.height - 10
		);
	}
}

function createPlatforms(canvas) {
	return [
		//mur a gauche pourempecher le joueur de sortir
		new Platform(-1, canvas.height - 500, 1, 1000, "ice_block"),
		new Platform(0, canvas.height - 20, 816, 20, "snow_ground"),

		// Niveau 1 -> ( Thibaud )
		new Platform(1350, canvas.height - 20, 2300, 20, "snow_ground"),
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

		// Fin niveau 1
		// Niveau 2 -> Matéo
		new Platform(1700, canvas.height - 100, 100, 20, "ice_block"),
		new Platform(1800, canvas.height - 200, 100, 20, "ice_block"),
		new Platform(2150, canvas.height - 200, 100, 20, "ice_block"),
		new Platform(2320, canvas.height - 200, 100, 20, "ice_block"), // Deuxieme plateforme du saut bloqué

		// Plateforme bloquant le saut
		new Platform(2150, canvas.height - 800, 270, 520, "ice_cliff"),

		new Platform(2680, canvas.height - 200, 100, 20, "ice_block"),

		new Bouncer(2800, canvas.height - 100, 100, 20, "ice_block"), // BOUNCER

		new Platform(3000, canvas.height - 500, 100, 20, "ice_block"),

		// Tour vers le bas. ===========================
		// Bloc sur le cote
		new Platform(3100, canvas.height - 500, 100, 480, "ice_block"),
		new Platform(3400, canvas.height - 800, 20, 700, "ice_block"),

		// Plateforme dans la tour
		// Relié avec les ennemis entre la ligne x et x
		new DisappearingPlatform(3200, canvas.height - 500, 100, 20),
		new DisappearingPlatform(3300, canvas.height - 310, 100, 20),
		new DisappearingPlatform(3200, canvas.height - 120, 100, 20),

		// Fin niveau 2
		// Niveau 3 -> Thibaud

		new Platform(3620, canvas.height - 100, 30, 10, "ice_block"),
		new DisappearingPlatform(3920, canvas.height - 120, 30, 10),
		new Platform(4120, canvas.height - 200, 30, 10, "ice_block"),
		new DisappearingPlatform(3920, canvas.height - 300, 30, 10),
		new Platform(4120, canvas.height - 400, 30, 10, "ice_block"),
		new DisappearingPlatform(3920, canvas.height - 500, 30, 10),
		new Platform(4120, canvas.height - 600, 30, 10, "ice_block"),
		new Platform(4220, canvas.height - 650, 49, 900, "ice_block"),
		new Platform(4320, canvas.height - 600, 30, 10, "ice_block"),
		new DisappearingPlatform(4820, canvas.height - 500, 700, 10),
		new DisappearingPlatform(5150, canvas.height - 550, 30, 10),
		new DisappearingPlatform(5050, canvas.height - 620, 30, 10),
		new DisappearingPlatform(5250, canvas.height - 620, 30, 10),
		new DisappearingPlatform(5150, canvas.height - 710, 30, 10),
		new Bouncer(4550, canvas.height - 100, 100, 10),

		// Sol a la fin du niveau 3
		new Platform(5500, canvas.height - 20, 10000, 20, "snow_ground"),

		// Mur et porte à la fin du niveau 3
		new Platform(5700, canvas.height - 800, 100, 720, "ice_cliff"),

		// Fin niveau 3
		// Niveau 4 -> Mathis

		// Niveau de Mathis -> Les scies
		new Platform(5930, canvas.height - 400, 2300, 50, "ice_cliff"), // Sol de premier étage

		new Platform(7610, canvas.height - 90, 40, 50, "ice_cliff"),
		new Platform(5930, canvas.height - 70, 300, 50, "ice_cliff"), // Première plateforme rdc
		new Platform(6280, canvas.height - 70, 600, 50, "ice_cliff"), // Plateforme du mileu en rdc
		new Platform(6530, canvas.height - 180, 100, 10, "ice_block"), // Plateforme pour sauter dessus
		new Platform(6930, canvas.height - 70, 600, 50, "ice_cliff"),
		// new Platform(7680, canvas.height - 400, 50, 380, "ice_cliff"),
		new Platform(6930, canvas.height - 70, 750, 50, "ice_cliff"),
		new Platform(7680, canvas.height - 400, 50, 380, "ice_cliff"),
		new Platform(7680, canvas.height - 700, 50, 235, "ice_cliff"),

		new Platform(5800, canvas.height - 180, 40, 10, "ice_block"),
		new Platform(5880, canvas.height - 260, 40, 10, "ice_block"),
		new Platform(5800, canvas.height - 340, 40, 10, "ice_block"),
		new Platform(5800, canvas.height - 730, 1930, 80, "ice_cliff"),
		new Platform(6400, canvas.height - 500, 4, 4, "ice_block"),

		// Mur de fin

		new Platform(),

		//Niveau 3 -> Matéo
	];
}

function createDoors(canvas) {
	return [
		new Door(1450, canvas.height - 95, 60, 80),
		new Door(3380, canvas.height - 95, 60, 80),
		new Door(5725, canvas.height - 95, 60, 80),
		new Door(7680, canvas.height - 470, 60, 80),
	];
}
