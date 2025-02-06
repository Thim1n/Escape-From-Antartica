// Fichier game.js
window.onload = function () {
    const backgroundMusic = document.getElementById("backgroundMusic");
  
    if (!backgroundMusic) {
      console.error("Background music not found");
      return;
    }
  
    // 1. Canvas initialization
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // 2. Game elements initialization
    const platforms = createPlatforms(canvas);
    const player = new Player(20, canvas.height - 70);
    let coins = createCoins(canvas);
    let clée = createClées(canvas);
    let enemies = createEnemies(canvas);
    let triggerZones = createTriggerZones(canvas);
    let doors = createDoors(canvas);
    let victoryZone = new VictoryZone(1850, canvas.height - 100);
  
    let startTime = Date.now();
    let gameTime = 0;
    let isGameWon = false;
    let cameraX = 0, cameraY = 0;
  
    // Event listeners for resizing and key events
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  
    const keysPressed = {};
    window.addEventListener("keydown", (event) => keysPressed[event.code] = true);
    window.addEventListener("keyup", (event) => delete keysPressed[event.code]);
  
    function formatTime(ms) {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const milliseconds = Math.floor((ms % 1000) / 10);
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
  
    // Game loop
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!isGameWon) gameTime = Date.now() - startTime;
  
      // Camera movement and platform rendering
      cameraX = Math.max(0, player.x - canvas.width / 2 + player.width / 2);
      cameraY = Math.max(0, Math.min(player.y - canvas.height / 2 + player.height / 2, canvas.height - player.height));
  
      ctx.save();
      ctx.translate(-cameraX, -cameraY);
  
      // Draw game elements
      platforms.forEach(platform => platform.draw(ctx));
      coins.forEach(coin => coin.draw(ctx));
      clée.forEach(clée => clée.draw(ctx));
      enemies.forEach(enemy => enemy.draw(ctx));
      doors.forEach(door => door.draw(ctx));
      victoryZone.draw(ctx);
      player.draw(ctx);
  
      ctx.restore();
  
      // Update game state
      if (!isGameWon) {
        updatePlayerMovement();
        player.update(platforms, doors);
        moveAllEnemies();
  
        if (victoryZone.checkVictory(player)) isGameWon = true;
  
        checkCollisions();
      }
  
      // Display game stats
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Temps: ${formatTime(gameTime)}`, 10, 30);
      ctx.fillText(`Pièces: ${player.coins}`, 10, 55);
      ctx.fillText(`Clées: ${player.clées}`, 10, 80);
      ctx.fillText(`Morts: ${player.deathCount}`, 10, 105);
  
      // Victory screen
      if (isGameWon) {
        ctx.fillStyle = "green";
        ctx.font = "40px Arial";
        ctx.fillText("Victoire !", canvas.width / 2 - 80, canvas.height / 2);
        ctx.font = "30px Arial";
        ctx.fillText(`Temps final: ${formatTime(gameTime)}`, canvas.width / 2 - 100, canvas.height / 2 + 40);
      }
  
      requestAnimationFrame(gameLoop);
    }
  
    function updatePlayerMovement() {
      if (keysPressed["ArrowLeft"] || keysPressed["KeyA"]) player.moveLeft();
      else if (keysPressed["ArrowRight"] || keysPressed["KeyD"]) player.moveRight();
      else player.stop();
  
      if ((keysPressed["Space"] || keysPressed["ArrowUp"]) && player.canJump()) player.jump();
    }
  
    function checkCollisions() {
      checkCoinCollisions();
      checkCléeCollisions();
      checkEnemyCollisions();
      checkDoorCollisions();
      checkTriggerZoneCollisions();
    }
  
    function checkCoinCollisions() {
      coins = coins.filter(coin => {
        if (player.collidesWith(coin)) {
          player.collectCoin();
          return false; // remove coin from array
        }
        return true;
      });
    }
  
    function checkCléeCollisions() {
      clée = clée.filter(clée => {
        if (player.collidesWith(clée)) {
          player.collectClée();
          return false; // remove clée from array
        }
        return true;
      });
    }
  
    function checkEnemyCollisions() {
      enemies.forEach(enemy => {
        if (player.collidesWith(enemy)) {
          player.die(enemies, triggerZones, canvas);
          resetClées();
        }
      });
    }
  
    function checkDoorCollisions() {
      doors.forEach(door => {
        if (player.collidesWith(door)) door.open(player);
      });
    }
  
    function checkTriggerZoneCollisions() {
      if (triggerZones) {
        triggerZones.forEach(zone => {
          if (zone.checkTrigger(player)) enemies.push(zone.enemy);
        });
      }
    }
  
    function moveAllEnemies() {
      enemies.forEach(enemy => {
        if (enemy instanceof MovingEnemy) enemy.move();
        else if (enemy instanceof RoundEnemy) enemy.update();
      });
    }
  
    function resetClées() {
      clée = createClées(canvas);
    }
  
    // Reset game
    function resetGame() {
      startTime = Date.now();
      isGameWon = false;
      gameTime = 0;
      player.reset();
      victoryZone.reset();
    }
  
    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyR") resetGame();
    });
  
    gameLoop();
  };
  
  // Classe Player avec la méthode collidesWith ajoutée
  class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 60;
      this.coins = 0;
      this.clées = 0;
      this.deathCount = 0;
    }
  
    draw(ctx) {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  
    update(platforms, doors) {
      // Logique de mise à jour du joueur
    }
  
    moveLeft() {
      this.x -= 5;
    }
  
    moveRight() {
      this.x += 5;
    }
  
    stop() {
      // Arrêter le mouvement horizontal
    }
  
    jump() {
      // Logique de saut
    }
  
    canJump() {
      // Logique de vérification du saut
      return true;
    }
  
    collidesWith(other) {
      return !(this.x + this.width < other.x || 
               this.x > other.x + other.width || 
               this.y + this.height < other.y || 
               this.y > other.y + other.height);
    }
  
    collectCoin() {
      this.coins++;
    }
  
    collectClée() {
      this.clées++;
    }
  
    die(enemies, triggerZones, canvas) {
      this.deathCount++;
      // Logique de mort
    }
  
    reset() {
      // Réinitialisation du joueur
    }
  }
  
  // Vous aurez besoin de définir ou d'importer les classes createPlatforms, createCoins, etc.
  