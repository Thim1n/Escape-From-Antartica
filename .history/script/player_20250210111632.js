class Player {
  constructor(x, y) {
    this.x = x;
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
    this.sprite = "../assets/sprite/playerNothing.png";
    this.isWalking = false;
    this.walkFrame = 0;

    this.images = {
      standing: new Image(),
      
    }
  }

  animateWalk() {
    if (this.isWalking) {
      this.walkFrame = (this.walkFrame + 1) % 2;
      this.sprite = `../assets/sprite/playerWalk${this.walkFrame + 1}.png`;
      setTimeout(() => this.animateWalk(), 300);
    } else {
      this.sprite = "../assets/sprite/playerNothing.png";
    }
  }

  update(platforms, doors) {
    this.velocityY += this.gravity;
    const oldX = this.x;
    const oldY = this.y;
    let newY = this.y + this.velocityY;
    let newX = this.x + this.velocityX;
    let isOnGround = false;

    for (let platform of platforms) {
      if (platform instanceof DisappearingPlatform && !platform.isVisible) {
        continue;
      }

      if (this.checkCollision(newX, this.y, platform)) {
        newX =
          this.velocityX > 0
            ? platform.x - this.width
            : platform.x + platform.width;
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

    for (let door of doors) {
      if (!door.isOpen) {
        if (this.checkCollision(newX, this.y, door)) {
          newX = this.velocityX > 0 ? door.x - this.width : door.x + door.width;
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

  draw(ctx) {
    const img = new Image();
    img.src = this.sprite;
    img.onload = () =>
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }

  collectCoin() {
    this.coins++;
  }

  collectClée() {
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
