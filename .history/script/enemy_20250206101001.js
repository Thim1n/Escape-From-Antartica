//Fichier ennemy.js
class Enemy {
  constructor(x, y, width = 40, height = 50) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // Pré-calcul des limites
    this.right = x + width;
    this.bottom = y + height;
  }

  update() {}

  draw(ctx) {
    // Pas besoin de save/restore pour une opération simple
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(player) {
    // Pré-calcul des limites du joueur
    const playerRight = player.x + player.width;
    const playerBottom = player.y + player.height;

    if (
      this.x < playerRight &&
      this.right > player.x &&
      this.y < playerBottom &&
      this.bottom > player.y
    ) {
      player.die();
    }
  }
}

class MovingEnemy extends Enemy {
  constructor(x, y, minX, maxX, minY, maxY, speed) {
    super(x, y);
    this.minX = minX;
    this.maxX = maxX;
    this.minY = Math.min(minY, maxY);
    this.maxY = Math.max(minY, maxY);
    this.speed = speed;
    this.directionX = 1;
    this.directionY = 1;
    // Pré-calcul des limites avec la largeur
    this.maxXWithWidth = this.maxX - this.width;
    this.maxYWithHeight = this.maxY - this.height;
  }

  movE() {
    if (this.minX !== this.maxX) {
      this.x += this.speed * this.directionX;
      if (this.x <= this.minX || this.x >= this.maxXWithWidth) {
        this.directionX *= -1;
        this.x = this.x <= this.minX ? this.minX : this.maxXWithWidth;
      }
    }

    if (this.minY !== this.maxY) {
      this.y += this.speed * this.directionY;
      if (this.y <= this.minY) {
        this.y = this.minY;
        this.directionY = 1;
      } else if (this.y >= this.maxYWithHeight) {
        this.y = this.maxYWithHeight;
        this.directionY = -1;
      }
    }

    // Mise à jour des limites de collision
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }
}

class TriggerEnemy extends MovingEnemy {
  constructor(x, y, minX, maxX, minY, maxY, speed) {
    super(x, y, minX, maxX, minY, maxY, speed);
    this.isAlive = true;
    this.isTriggered = false;
  }

  trigger() {
    if (!this.isTriggered) {
      this.isTriggered = true;
    }
  }

  removeEnemy() {
    if (!this.isAlive) return; // Évite les appels multiples
    this.isAlive = false;
    const index = enemies.indexOf(this);
    if (index > -1) {
      enemies.splice(index, 1);
    }
  }

  reset() {
    this.isAlive = true;
    this.isTriggered = false;
    this.x = this.minX;
    this.y = this.minY;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }
}

class SpikeEnemy extends Enemy {
  constructor(x, y, width = 30, height = 30) {
    super(x, y, width, height);
    this.color = "#8B0000";
    // Pré-calcul des points du triangle
    this.points = {
      topX: this.x + width / 2,
      topY: this.y,
      rightX: this.x + width,
      rightY: this.y + height,
      leftX: this.x,
      leftY: this.y + height,
    };
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#600000";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.points.topX, this.points.topY);
    ctx.lineTo(this.points.rightX, this.points.rightY);
    ctx.lineTo(this.points.leftX, this.points.leftY);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }
}

class RoundEnemy extends Enemy {
  constructor(x, y, radius = 20, imageSrc, speed = 2, minX = 0, maxX = 500) {
    super(x, y, radius * 2, radius * 2); // On passe la largeur et la hauteur du cercle (diamètre)
    this.radius = radius; // Rayon du cercle
    this.image = new Image(); // Créer un objet Image
    this.image.src = imageSrc; // Source de l'image à charger
    this.speed = speed; // Vitesse de l'ennemi
    this.directionX = 1; // Direction initiale sur l'axe X
    this.minX = minX; // Position minimale pour le mouvement (limite gauche)
    this.maxX = maxX; // Position maximale pour le mouvement (limite droite)
    this.rotation = 0; // Angle de rotation de l'image
  }

  update() {
    // Déplacement de l'ennemi uniquement sur l'axe X
    this.x += this.speed * this.directionX;

    // Rotation de l'image à chaque déplacement horizontal
    this.rotation += 0.05; // Ajustez la vitesse de rotation ici

    // Inverser la direction lorsqu'il atteint les bords
    if (this.x <= this.minX || this.x >= this.maxX - this.width) {
      this.directionX *= -1; // Changer de direction
    }

    // Mise à jour des limites de collision
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  draw(ctx) {
    // Sauvegarde de l'état du contexte avant de le transformer
    ctx.save();

    // Déplacement de l'origine de la rotation vers le centre de l'image
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Appliquer la rotation (en radians)
    ctx.rotate(this.rotation);

    // Dessiner l'image avec l'origine décalée
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    // Restauration du contexte après transformation
    ctx.restore();
  }

  // Vérification des collisions avec le joueur
  checkCollision(player) {
    const distX = Math.abs(
      player.x + player.width / 2 - (this.x + this.radius)
    );
    const distY = Math.abs(
      player.y + player.height / 2 - (this.y + this.radius)
    );

    if (
      distX <= player.width / 2 + this.radius &&
      distY <= player.height / 2 + this.radius
    ) {
      player.die();
    }
  }
}

function createEnemies(canvas) {
  if (!canvas) return [];

  const enemies = [];
  const height = canvas.height;

  // Ajout de l'ennemi mobile
  enemies.push(
    new MovingEnemy(
      710,
      height - 650,
      600,
      820,
      height - 460,
      height - 460,
      2.5
    )
  );

  // Ajout de l'ennemi rond avec mouvement gauche-droite
  enemies.push(
    new RoundEnemy(2500, 475, 80, "../assets/sprite/scie.png", 14, 1700, 3400)
  ); // Déplacement entre x = 2000 et x = 2700

  // Configuration des groupes de spikes
  const spikeGroups = [
    // Premier groupe
    { startX: 320, y: height - 250, count: 2, spacing: 30 },
    // Groupe au sol
    { startX: 820, y: height - 30, count: 17, spacing: 30 },
    // Dernier groupe
    { startX: 2340, y: height - 100, count: 4, spacing: 30 },
  ];

  // Création efficace des spikes
  spikeGroups.forEach((group) => {
    for (let i = 0; i < group.count; i++) {
      enemies.push(new SpikeEnemy(group.startX + i * group.spacing, group.y));
    }
  });

  return enemies;
}
