class Player {
  constructor(x, y) {
    this.x = 3000;
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
    this.clées = 0;
    this.spawnX = x;
    this.spawnY = y;
    this.isWalking = false;
    this.walkFrame = 0;

    this.facingRight = true;

    this.images = {
      standing: new Image(),
      walking1: new Image(),
      walking2: new Image(),
    };

    this.images.standing.src = "../assets/sprite/playerNothing.png";
    this.images.walking1.src = "../assets/sprite/playerWalk1.png";
    this.images.walking2.src = "../assets/sprite/playerWalk2.png";

    this.currentImage = this.images.standing;
  }

  animateWalk() {
    if (this.isWalking) {
      this.walkFrame = (this.walkFrame + 1) % 2;
      this.currentImage =
        this.walkFrame === 0 ? this.images.walking1 : this.images.walking2;
      this.facingRight = this.velocityX >= 0; // Met à jour la direction
      setTimeout(() => this.animateWalk(), 300);
    } else {
      this.currentImage = this.images.standing;
    }
  }

  draw(ctx) {
    ctx.save();

    // Position de base
    if (!this.facingRight) {
      // Pour aller vers la gauche
      ctx.scale(-1, 1);
      ctx.translate(-this.x - this.width, this.y);
    } else {
      // Pour aller vers la droite
      ctx.translate(this.x, this.y);
    }

    // Dessiner l'image
    ctx.drawImage(this.currentImage, 0, 0, this.width, this.height);

    ctx.restore();
  }

  update(platforms, doors) {
    // Appliquer la gravité
    this.velocityY += this.gravity;
  
    // Sauvegarder les anciennes positions
    const oldX = this.x;
    const oldY = this.y;
  
    // Calculer les nouvelles positions potentielles
    let newX = this.x + this.velocityX;
    let newY = this.y + this.velocityY;
  
    let isOnGround = false; // Indique si le joueur est sur une plateforme ou au sol
  
    // Gérer les collisions avec les plateformes
    for (let platform of platforms) {
      // Ignorer les plateformes disparues
      if (platform instanceof DisappearingPlatform && !platform.isVisible) {
        continue;
      }
  
      // Gestion des pentes
      if (platform instanceof Pente) {
        if (platform.handleCollision(this)) {
          isOnGround = true; // Le joueur est sur une pente
          newX = this.x + this.velocityX; // Ajuster la position horizontale pour éviter les téléportations
          newY = this.y; // La méthode handleCollision ajuste déjà la position verticale
          break; // Sortir de la boucle car la collision est gérée
        }
      }
  
      // Gestion des plateformes rebondissantes (Bouncer)
      if (platform instanceof Bouncer) {
        if (platform.handleCollision(this)) {
          newY = platform.y - this.height; // Positionner le joueur au-dessus du bouncer
          continue; // Collision gérée, passer à l'itération suivante
        }
      }
  
      // Gestion des collisions classiques avec une plateforme
      if (this.checkCollision(newX, newY, platform)) {
        if (oldY + this.height <= platform.y) {
          // Collision par le haut (le joueur atterrit sur la plateforme)
          newY = platform.y - this.height;
          this.velocityY = 0;
          isOnGround = true; // Le joueur est sur le sol ou une plateforme
          this.isJumping = false;
  
          // Gestion spécifique pour les plateformes disparaissantes
          if (platform instanceof DisappearingPlatform) {
            platform.handleCollision(this); // Déclenche l'effet de disparition
            if (!platform.isVisible) {
              newY = oldY + this.velocityY; // Si elle disparaît, le joueur tombe
              isOnGround = false;
              this.isJumping = true;
            }
          }
        } else if (oldY >= platform.y + platform.height) {
          // Collision par le bas (le joueur frappe la plateforme en sautant)
          newY = platform.y + platform.height;
          this.velocityY = 0; // Arrêter le mouvement vertical
        } else {
          // Collision horizontale avec une plateforme classique
          newX =
            this.velocityX > 0
              ? platform.x - this.width // Collision par la droite
              : platform.x + platform.width; // Collision par la gauche
          this.velocityX = 0; // Arrêter le mouvement horizontal
        }
      }
    }
  
    // Gérer les collisions avec les portes
    for (let door of doors) {
      if (!door.isOpen) {
        if (this.checkCollision(newX, newY, door)) {
          if (oldY + this.height <= door.y) {
            // Collision par le haut (le joueur atterrit sur la porte)
            newY = door.y - this.height;
            this.velocityY = 0;
            isOnGround = true; // Le joueur est sur le sol ou une porte fermée
            this.isJumping = false;
          } else if (oldY >= door.y + door.height) {
            // Collision par le bas (le joueur frappe la porte en sautant)
            newY = door.y + door.height;
            this.velocityY = 0; // Arrêter le mouvement vertical
          } else {
            // Collision horizontale avec une porte fermée
            newX =
              this.velocityX > 0 ? door.x - this.width : door.x + door.width;
            this.velocityX = 0; // Arrêter le mouvement horizontal
          }
        }
      }
    }
  
    // Mettre à jour les positions finales du joueur après toutes les collisions traitées
    this.x = newX;
    this.y = newY;
  
    // Si aucune plateforme ou pente ne supporte le joueur, il tombe librement.
    if (!isOnGround) {
      this.isJumping = true;
    }
  
    // Gérer l'état de marche du joueur uniquement s'il n'est pas sur une pente glissante.
    const isOnSlope =
      platforms.some((p) => p instanceof Pente && p.handleCollision(this));
      
     if (!isOnSlope && !this.isJumping) {
       if (this.velocityX !== 0) {
         this.startWalking();
       } else {
         this.stopWalking();
       }
     }
  }
  

  checkCollision(x, y, obj) {
    return (
      x + this.width > obj.x &&
      x < obj.x + obj.width &&
      y + this.height > obj.y &&
      y < obj.y + obj.height
    );
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -10;
      this.isJumping = true;
    }
  }

  moveLeft() {
    this.velocityX = -this.speed;
    this.startWalking();
  }

  moveRight() {
    this.velocityX = this.speed;
    this.startWalking();
  }

  stop() {
    this.velocityX = 0;
    this.stopWalking();
  }

  collectCoin() {
    this.coins++;
  }

  collectclée() {
    this.clées++;
  }

  die(enemies, triggerZones) {
    this.deathCount++;
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.clées = 0;

    if (triggerZones) {
      triggerZones.forEach((zone) => {
        zone.reset();
        if (
          zone.enemy instanceof TriggerEnemy ||
          zone.enemy instanceof SpikeEnemy
        ) {
          const index = enemies.indexOf(zone.enemy);
          if (index > -1) {
            enemies.splice(index, 1);
          }
        }
      });
    }
  }

  setSpawnPoint(x, y) {
    this.spawnX = x;
    this.spawnY = y;
  }

  startWalking() {
    if (!this.isWalking) {
      this.isWalking = true;
      this.animateWalk();
    }
  }

  stopWalking() {
    this.isWalking = false;
  }
}
/**/
