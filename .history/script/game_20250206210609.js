window.onload = function () {
  const backgroundMusic = document.getElementById("backgroundMusic");
  if (!backgroundMusic) {
    console.error("Background music not found");
    return;
  }

  // Canvas setup
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Game state
  let isGameWon = false;
  let gameTime = 0;
  let startTime = Date.now();
  let timerStarted = false;
  let cameraX = 0;
  let cameraY = 0;
  const keysPressed = {};

  // Game elements
  const platforms = createPlatforms(canvas);
  const player = new Player(20, canvas.height - 20 - 50);
  let coins = createCoins(canvas);
  let clée = createClées(canvas);
  let enemies = createEnemies(canvas);
  let triggerZones = createTriggerZones(canvas);
  let doors = createDoors(canvas);
  const victoryZone = new VictoryZone(1850, canvas.height - 100);

  // Event listeners
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  window.addEventListener("keydown", (event) => {
    keysPressed[event.code] = true;
    if (event.code === "Space" || event.code === "ArrowUp") {
      player.jump();
    }
    if (event.code === "KeyR") {
      resetGame();
    }
  });

  window.addEventListener("keyup", (event) => {
    delete keysPressed[event.code];
  });

  // Utility functions
  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`;
  }

  function startMusicWhenTimerStarts() {
    if (!timerStarted) {
      backgroundMusic
        .play()
        .catch((error) => console.log("🚨 Erreur de lecture :", error));
      timerStarted = true;
    }
  }

  // Game mechanics
  function updatePlayerMovement() {
    if (keysPressed["ArrowLeft"] || keysPressed["KeyA"]) {
      player.moveLeft();
    } else if (keysPressed["ArrowRight"] || keysPressed["KeyD"]) {
      player.moveRight();
    } else {
      player.stop();
    }
  }

  function checkCoinCollisions() {
    coins = coins.filter((coin) => {
      if (checkCollision(player, coin)) {
        player.collectCoin();
        return false;
      }
      return true;
    });
  }

  function checkCléeCollisions() {
    clée = clée.filter((clée) => {
      if (checkCollision(player, clée)) {
        player.collectclée();
        return false;
      }
      return true;
    });
  }

  function checkEnemyCollisions() {
    enemies.forEach((enemy) => {
      if (checkCollision(player, enemy)) {
        player.die(enemies, triggerZones, canvas);
        resetClées();
      }
    });
  }

  function checkDoorCollisions() {
    doors.forEach((door) => {
      if (checkCollision(player, door, 10)) {
        door.open(player);
      }
    });
  }

  function checkCollision(obj1, obj2, padding = 0) {
    return (
      obj1.x < obj2.x + (obj2.width || obj2.radius * 2) + padding &&
      obj1.x + obj1.width > obj2.x - padding &&
      obj1.y < obj2.y + (obj2.height || obj2.radius * 2) &&
      obj1.y + obj1.height > obj2.y
    );
  }

  function moveAllEnemies() {
    enemies.forEach((enemy) => {
      if (enemy instanceof MovingEnemy) {
        enemy.move();
      } else if (enemy instanceof RoundEnemy) {
        enemy.update();
      }
    });
  }

  function resetClées() {
    clée = createClées(canvas);
  }

  function resetGame() {
    startTime = Date.now();
    isGameWon = false;
    gameTime = 0;
    player.x = player.startX;
    player.y = player.startY;
    player.coins = 0;
    player.clées = 0;
    player.deathCount = 0;
    victoryZone.reset();
  }

  function updateCamera() {
    cameraX = player.x - canvas.width / 2 + player.width / 2;
    cameraY = player.y - canvas.height / 2 + player.height / 2;
    cameraX = Math.max(0, cameraX);
    cameraY = Math.max(0, Math.min(cameraY, canvas.height - player.height));
  }

  async function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    platforms.forEach((platform) => platform.draw(ctx));
    coins.forEach((coin) => coin.draw(ctx));
    clée.forEach((clée) => clée.draw(ctx));
    enemies.forEach((enemy) => enemy.draw(ctx));
    doors.forEach((door) => door.draw(ctx));
    victoryZone.draw(ctx);
    player.draw(ctx);

    ctx.restore();

    // UI elements
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Temps: ${formatTime(gameTime)}`, 10, 30);
    ctx.fillText(`Pièces: ${player.coins}`, 10, 55);
    ctx.fillText(`Clées: ${player.clées}`, 10, 80);
    ctx.fillText(`Morts: ${player.deathCount}`, 10, 105);

    if (isGameWon) {
      ctx.fillStyle = "green";
      ctx.font = "40px Arial";
      ctx.fillText("Victoire !", canvas.width / 2 - 80, canvas.height / 2);
      ctx.font = "30px Arial";
      ctx.fillText(
        `Temps final: ${formatTime(gameTime)}`,
        canvas.width / 2 - 100,
        canvas.height / 2 + 40
      );
      const PLAYERNAME = localStorage.getItem("playerName");
try {
  let res = await fetch("http://localhost:3000/savegame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score: gameTime,
      name: PLAYERNAME
    })
  });
} catch (error) {
  console.error("Erreur lors de la sauvegarde:", error);
}

  // Main game loop with FPS limitation
  function gameLoop() {
    const FPS = 60;
    const frameDelay = 1000 / FPS;
    let lastFrameTime = 0;

    function update(currentTime) {
      const elapsed = currentTime - lastFrameTime;

      if (elapsed > frameDelay) {
        lastFrameTime = currentTime;

        if (!isGameWon) {
          gameTime = Date.now() - startTime;
          startMusicWhenTimerStarts();

          updatePlayerMovement();
          player.update(platforms, doors);
          moveAllEnemies();
          updateCamera();

          checkCoinCollisions();
          checkEnemyCollisions();
          checkCléeCollisions();
          checkDoorCollisions();

          if (victoryZone.checkVictory(player)) {
            isGameWon = true;
          }

          if (triggerZones) {
            triggerZones.forEach((zone) => {
              if (zone.checkTrigger(player)) {
                enemies.push(zone.enemy);
              }
            });
          }
        }

        drawGame();
      }
      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  gameLoop();
};
