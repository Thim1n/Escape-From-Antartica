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
    this.isWalking = false;
    this.walkFrame = 0;

    // Précharger les images
    this.images = {
      standing: new Image(),
      walk1: new Image(),
      walk2: new Image()
    };

    this.images.standing.src = "../assets/sprite/playerNothing.png";
    this.images.walk1.src = "../assets/sprite/playerWalk1.png";
    this.images.walk2.src = "../assets/sprite/playerWalk2.png";

    this.currentImage = this.images.standing;
  }

  // ...existing methods...
}
