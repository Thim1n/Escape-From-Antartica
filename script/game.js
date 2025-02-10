window.onload = function () {
  let isGameSaved = false;
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
  const victoryZone = new VictoryZone(3550, canvas.height - 300);
  let isPaused = false;
  // Création des éléments du menu pause
  const pauseMenu = document.createElement('div');
  pauseMenu.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 10px;
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  `;
  document.body.appendChild(pauseMenu);

  // Création des boutons
  const resumeButton = document.createElement('button');
  resumeButton.textContent = 'Continuer';
  resumeButton.style.cssText = `
    padding: 10px 20px;
    font-size: 18px;
    margin: 5px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    width: 200px;
  `;

  const mainMenuButton = document.createElement('button');
  mainMenuButton.textContent = 'Menu Principal';
  mainMenuButton.style.cssText = `
    padding: 10px 20px;
    font-size: 18px;
    margin: 5px;
    cursor: pointer;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    width: 200px;
  `;

  pauseMenu.appendChild(resumeButton);
  pauseMenu.appendChild(mainMenuButton);

  // Gestionnaires d'événements pour les boutons
  resumeButton.addEventListener('click', () => {
    togglePause();
  });

  mainMenuButton.addEventListener('click', () => {
    window.location.href = '../index.html'; // Redirection vers le menu principal
  });

  // Modifiez les event listeners pour inclure la touche Escape
  window.addEventListener("keydown", (event) => {
    keysPressed[event.code] = true;
    if (event.code === "Space" || event.code === "ArrowUp") {
      if (!isPaused) player.jump();
    }
    if (event.code === "KeyR") {
      if (!isPaused) resetGame();
    }
    if (event.code === "Escape") {
      togglePause();
    }
  });

  // Fonction pour basculer l'état de pause
  function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
      pauseMenu.style.display = 'flex';
      if (backgroundMusic) backgroundMusic.pause();
    } else {
      pauseMenu.style.display = 'none';
      if (backgroundMusic && timerStarted) backgroundMusic.play();
    }
  }

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
    // Calcul de la position idéale de la caméra
    const targetX = player.x - canvas.width / 2 + player.width / 2;
    const targetY = player.y - canvas.height / 2 + player.height / 2;

    // Limites du monde
    const maxX = 2000 - canvas.width;
    const minY = 0;
    const maxY = Math.max(0, canvas.height - player.height);

    // Application des limites avec smoothing
    cameraX = Math.max(0, Math.min(targetX, 5000));

    // Mise à jour de la caméra Y avec des limites plus appropriées
    cameraY = Math.max(minY, Math.min(targetY, maxY));
  }

  async function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-cameraX, -cameraY);

    // Draw game elements
    platforms.forEach((platform) => platform.draw(ctx));
    coins.forEach((coin) => coin.draw(ctx));
    clée.forEach((clée) => clée.draw(ctx));
    enemies.forEach((enemy) => enemy.draw(ctx));
    doors.forEach((door) => door.draw(ctx));
    /*triggerZones.forEach((zone) => zone.draw(ctx));*/
    victoryZone.draw(ctx);
    player.draw(ctx);

    ctx.restore();

    // Draw UI elements
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
      if (!isGameSaved) {
        saveGameAPI();
        isGameSaved = true;
      }
    }
  }

  function saveGameAPI() {
    const playerName = localStorage.getItem("playerName");
    const playerTime = gameTime;

    try {
      fetch("http://localhost:3000/savegame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: playerTime,
          name: playerName,
        }),
      });
    } catch (error) {
      console.error("Error saving game", error);
    }
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

        if (!isGameWon && !isPaused) {  // Ajout de la condition !isPaused
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
        
        // Ajout d'un overlay sombre quand le jeu est en pause
        if (isPaused) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  gameLoop();
};
La