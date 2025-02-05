class Player {
  constructor(x, y) {
    this.x = 50;
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
    this.
    this.deathCount = 0;
    this.startX = x;
    this.startY = y;
  }

  update(platforms) {
    // Appliquer la gravité
    this.velocityY += this.gravity;

    // Sauvegarde de l'ancienne position pour les collisions
    const oldX = this.x;
    const oldY = this.y;

    // Mise à jour temporaire de la position
    let newY = this.y + this.velocityY;
    let newX = this.x + this.velocityX;

    let isOnGround = false;

    // Vérification des collisions pour chaque plateforme
    for (let platform of platforms) {
      // Vérifier si la plateforme est visible si c'est une plateforme qui disparaît
      if (platform instanceof DisappearingPlatform && !platform.isVisible) {
        continue;
      }

      // Vérification de la collision horizontale
      if (
        newX + this.width > platform.x &&
        newX < platform.x + platform.width &&
        this.y + this.height > platform.y &&
        this.y < platform.y + platform.height
      ) {
        // Collision à gauche ou à droite
        if (this.velocityX > 0) {
          newX = platform.x - this.width;
        } else if (this.velocityX < 0) {
          newX = platform.x + platform.width;
        }
        this.velocityX = 0;
      }

      // Vérification de la collision verticale
      if (
        newX + this.width > platform.x &&
        newX < platform.x + platform.width
      ) {
        // Collision par le haut de la plateforme (le joueur tombe sur la plateforme)
        if (
          oldY + this.height <= platform.y &&
          newY + this.height > platform.y
        ) {
          newY = platform.y - this.height;
          this.velocityY = 0;
          isOnGround = true;
          this.isJumping = false;

          // Gérer la collision avec une plateforme qui disparaît
          if (platform instanceof DisappearingPlatform) {
            platform.handleCollision(this);
            if (!platform.isVisible) {
              newY = oldY + this.velocityY;
              isOnGround = false;
              this.isJumping = true;
            }
          }
        }
        // Collision par le bas de la plateforme (le joueur saute et heurte le dessous)
        else if (
          oldY >= platform.y + platform.height &&
          newY < platform.y + platform.height
        ) {
          newY = platform.y + platform.height;
          this.velocityY = 0;
        }
        // Dans la boucle de vérification des collisions verticales
        if (platform instanceof DisappearingPlatform && isOnGround) {
          platform.handleCollision(this);
          if (!platform.isVisible) {
            newY = oldY + this.velocityY;
            isOnGround = false;
            this.isJumping = true;
            continue;
          }
        }
      }
    }

    // Appliquer les nouvelles positions
    this.x = newX;
    this.y = newY;

    // Limites du canvas
    /*
        if (this.y + this.height >= window.innerHeight) {
            this.y = window.innerHeight - this.height;
            this.velocityY = 0;
            this.isJumping = false;
            isOnGround = true;
        }
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > window.innerWidth) this.x = window.innerWidth - this.width;*/
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

  collectclée() {
    this.clées++;
}

  die(enemies, triggerZones) {
    this.deathCount++;
    this.x = this.startX;
    this.y = this.startY;
    this.velocityX = 0;
    this.velocityY = 0;

    if (triggerZones) {
      triggerZones.forEach((zone) => {
        zone.reset();
        if (zone.enemy instanceof TriggerEnemy) {
          const index = enemies.indexOf(zone.enemy);
          if (index > -1) {
            enemies.splice(index, 1);
          }
        }
      });
    }
  }
}
