class Player {
  constructor(x, y) {
    this.x = x; // Position initiale du joueur
    this.y = y;
    this.width = 40;
    this.height = 50;
    this.color = "blue";
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 0.4;
    this.isJumping = false;
    this.speed = 2;
    this.coins = 0;
    this.deathCount = 0;
    this.clées = 0;
    this.spawnX = x;
    this.spawnY = y;
  }

  update(platforms, doors) {
    this.velocityY += this.gravity;

    const oldX = this.x;
    const oldY = this.y;

    let newY = this.y + this.velocityY;
    let newX = this.x + this.velocityX;

    let isOnGround = false;

    // Vérifier les collisions avec les plateformes
    for (let platform of platforms) {
      if (platform instanceof DisappearingPlatform && !platform.isVisible) {
        continue;
      }

      if (this.checkCollision(newX, this.y, platform)) {
        if (this.velocityX > 0) {
          newX = platform.x - this.width;
        } else if (this.velocityX < 0) {
          newX = platform.x + platform.width;
        }
        this.velocityX = 0;
      }

      if (this.checkCollision(newX, newY, platform)) {
        if (oldY + this.height <= platform.y) {
          newY = platform.y - this.height;
          this.velocityY = 0;
          isOnGround = true;
          this.isJumping = false;

          if (platform instanceof DisappearingPlatform) {
            platform.handleCollision(this);
            if (!platform.isVisible) {
              newY = oldY + this.velocityY;
              isOnGround = false;
              this.isJumping = true;
            }
          }
        } else if (oldY >= platform.y + platform.height) {
          newY = platform.y + platform.height;
          this.velocityY = 0;
        }
      }
    }

    // Vérifier les collisions avec les portes fermées
    for (let door of doors) {
      if (!door.isOpen) {
        if (this.checkCollision(newX, this.y, door)) {
          if (this.velocityX > 0) {
            newX = door.x - this.width;
          } else if (this.velocityX < 0) {
            newX = door.x + door.width;
          }
          this.velocityX = 0;
        }

        if (this.checkCollision(newX, newY, door)) {
          if (oldY + this.height <= door.y) {
            newY = door.y - this.height;
            this.velocityY = 0;
            isOnGround = true;
            this.isJumping = false;
          } else if (oldY >= door.y + door.height) {
            newY = door.y + door.height;
            this.velocityY = 0;
          }
        }
      }
    }

    this.x = newX;
    this.y = newY;
  }

  checkCollision(x, y, platform) {
    return (
      x + this.width > platform.x &&
      x < platform.x + platform.width &&
      y + this.height > platform.y &&
      y < platform.y + platform.height
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
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.clées = 0;

    // Réinitialiser les zones de déclenchement
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
};

  startWalking() {
    this.isWalking = true;
    this.isIdle = false;
    this.isJumping = false;
  }

  startJumping() {
    this.isJumping = true;
    this.isWalking = false;
    this.isIdle = false;
    this.currentFrame = 0;
  }

  stopWalking() {
    this.isWalking = false;
    this.isIdle = true;
  }
}

// Initialisation
let playerElement = document.getElementById("player");
let animationManager = new AnimationManager(playerElement, 4);

// Création de l'instance de player
const player = new Player(20, 500); // Position initiale du joueur

// Fonction de mise à jour du jeu
function gameLoop() {
  player.update(platforms, doors);
  requestAnimationFrame(gameLoop);
}

gameLoop();

// Gestion des événements de clavier
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    player.moveRight();
  }
  if (event.key === "ArrowLeft") {
    player.moveLeft();
  }
  if (event.key === " ") {
    player.jump();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    player.stop();
  }
});
