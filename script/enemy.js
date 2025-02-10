class Enemy {
  constructor(x, y, width = 40, height = 50) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.right = x + width;
    this.bottom = y + height;
    this.facingRight = true;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(player) {
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
    this.maxXWithWidth = this.maxX - this.width;
    this.maxYWithHeight = this.maxY - this.height;
    this.delay = speed * 5;

    // Animation properties
    this.walkFrame = 0;
    this.facingRight = true;

    this.images = {
      walking1: new Image(),
      walking2: new Image(),
    };

    this.images.walking1.src = "../assets/sprite/enemyWalk1.png";
    this.images.walking2.src = "../assets/sprite/enemyWalk2.png";

    this.currentImage = this.images.walking1;

    // Start animation
    this.animateWalk();
  }

  animateWalk() {
    // Alterne entre 0 et 1
    this.walkFrame = (this.walkFrame + 1) % 2;

    // Met à jour l'image actuelle en fonction du frame
    if (this.walkFrame === 0) {
      this.currentImage = this.images.walking1;
    } else {
      this.currentImage = this.images.walking2;
    }

    // Met à jour la direction en fonction du mouvement
    this.facingRight = this.directionX > 0;

    // Programme la prochaine animation
    setTimeout(() => {
      if (this instanceof MovingEnemy) {
        this.animateWalk();
      }
    }, this.delay); // Réduit le délai pour une animation plus fluide
  }

  draw(ctx) {
    ctx.save();

    if (this.facingRight) {
      // Appliquer la translation d'abord
      ctx.translate(this.x + this.width, this.y);
      // Puis le retournement
      ctx.scale(-1, 1);
    } else {
      ctx.translate(this.x, this.y);
    }

    ctx.drawImage(this.currentImage, 0, 0, this.width, this.height);
    ctx.restore();

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.move();
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  move() {
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
    if (!this.isAlive) return;
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
  constructor(
    x,
    y,
    radius = 20,
    imageSrc,
    speed = 2,
    minX = 0,
    maxX = 500,
    minY = 0,
    maxY = 500,
    movementType = "horizontal"
  ) {
    super(x, y, radius * 2, radius * 2);
    this.radius = radius;
    this.image = new Image();
    this.image.src = imageSrc;
    this.speed = speed;
    this.directionX = 1;
    this.directionY = 1;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.movementType = movementType;
    this.rotationSpeed = 0.05; // Ajout d'une vitesse de rotation
    this.rotation = 0;
  }

  update() {
    if (this.movementType === "horizontal") {
      this.x += this.speed * this.directionX;
      if (this.x <= this.minX || this.x >= this.maxX - this.width) {
        this.directionX *= -1;
      }
    } else if (this.movementType === "vertical") {
      this.y += this.speed * this.directionY;
      if (this.y <= this.minY || this.y >= this.maxY - this.height) {
        this.directionY *= -1;
      }
    }

    this.rotation += this.rotationSpeed; // Mise à jour de la rotation

    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }

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

class HalfRoundEnemy extends Enemy {
  constructor(x, y, radius = 20, imageSrc, speed = 2, minX = 0, maxX = 500) {
    super(x, y, radius * 2, radius);
    this.radius = radius;
    this.image = new Image();
    this.image.src = imageSrc;
    this.speed = speed;
    this.directionX = 1;
    this.minX = minX;
    this.maxX = maxX;
    this.rotationSpeed = 0.05;
    this.rotation = 0;
  }

  update() {
    this.x += this.speed * this.directionX;
    this.rotation += this.rotationSpeed;

    if (this.x <= this.minX || this.x >= this.maxX - this.width) {
      this.directionX *= -1;
    }

    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.radius);
    ctx.rotate(this.rotation);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI, true);
    ctx.clip();
    ctx.drawImage(
      this.image,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2
    );
    ctx.restore();
  }

  checkCollision(player) {
    const centerX = this.x + this.radius;
    const centerY = this.y + this.radius;
    const closestX = Math.max(
      player.x,
      Math.min(centerX, player.x + player.width)
    );
    const closestY = Math.max(
      player.y,
      Math.min(centerY, player.y + player.height)
    );
    const distanceX = centerX - closestX;
    const distanceY = centerY - closestY;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    if (distanceSquared <= this.radius * this.radius && closestY <= centerY) {
      player.die();
    }
  }
}

function createEnemies(canvas) {
  if (!canvas) return [];

  const enemies = [];
  const height = canvas.height;

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
  enemies.push(new Enemy(-50, height, 10000, 0));

  enemies.push(
    new HalfRoundEnemy(
      1800,
      280,
      60,
      "../assets/sprite/scie.png",
      4,
      1700,
      3000
    )
  );
  enemies.push(
    new HalfRoundEnemy(
      2000,
      280,
      60,
      "../assets/sprite/scie.png",
      4,
      1700,
      3000
    )
  );
  enemies.push(
    new HalfRoundEnemy(
      2200,
      280,
      60,
      "../assets/sprite/scie.png",
      4,
      1700,
      3000
    )
  );
  enemies.push(
    new HalfRoundEnemy(
      2320,
      280,
      60,
      "../assets/sprite/scie.png",
      4,
      1700,
      3000
    )
  );
  enemies.push(
    new RoundEnemy(
      2500,
      475,
      80,
      "../assets/sprite/scie.png",
      13.5,
      1700,
      3400,
      0,
      height,
      "horizontal"
    )
  );
  enemies.push(
    new RoundEnemy(
      2800,
      100,
      40,
      "../assets/sprite/scie.png",
      6,
      2800,
      2800,
      90,
      320,
      "vertical"
    )
  );
  enemies.push(
    new RoundEnemy(
      3000,
      100,
      40,
      "../assets/sprite/scie.png",
      6,
      2800,
      2800,
      90,
      320,
      "vertical"
    )
  );

  const spikeGroups = [
    { startX: 320, y: height - 250, count: 2, spacing: 30 },
    { startX: 820, y: height - 30, count: 17, spacing: 30 },
    { startX: 2340, y: height - 100, count: 4, spacing: 30 },
  ];

  spikeGroups.forEach((group) => {
    for (let i = 0; i < group.count; i++) {
      enemies.push(new SpikeEnemy(group.startX + i * group.spacing, group.y));
    }
  });

  return enemies;
}
