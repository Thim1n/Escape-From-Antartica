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
    this.animationInterval = null;
  }

  startAnimation() {
    if (this.animationInterval) return;
    this.animationInterval = setInterval(() => {
      if (this.isWalking) {
        this.sprite =
          this.sprite === "../assets/sprite/playerWalk1.png"
            ? "../assets/sprite/playerWalk2.png"
            : "../assets/sprite/playerWalk1.png";
      } else {
        this.sprite = "../assets/sprite/playerNothing.png";
        clearInterval(this.animationInterval);
        this.animationInterval = null;
      }
    }, 300);
  }

  moveLeft() {
    this.velocityX = -this.speed;
    this.isWalking = true;
    this.startAnimation();
  }

  moveRight() {
    this.velocityX = this.speed;
    this.isWalking = true;
    this.startAnimation();
  }

  stop() {
    this.velocityX = 0;
    this.isWalking = false;
  }

  draw(ctx) {
    const img = new Image();
    img.src = this.sprite;
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
  }
}
