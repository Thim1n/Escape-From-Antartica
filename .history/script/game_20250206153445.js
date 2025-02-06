window.onload = function () {
    const backgroundMusic = document.getElementById("backgroundMusic");
  
    if (backgroundMusic) {
        // 1. Canvas initialization
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
  
        // 2. Game elements initialization
        const platforms = createPlatforms(canvas);
        const player = new Player(20, canvas.height - 20 - 50);
        let coins = createCoins(canvas);
        let clée = createClées(canvas);
        let enemies = createEnemies(canvas);
        let triggerZones = createTriggerZones(canvas); 
        let doors = createDoors(canvas);
        let startTime = Date.now();
        let isGameWon = false;
        let gameTime = 0;
        
        const victoryZone = new VictoryZone(1850, canvas.height - 100);
  
        let timerStarted = false;
  
        // Fonction pour démarrer la musique après le démarrage du chronomètre
        function startMusicWhenTimerStarts() {
          if (!timerStarted) {
            backgroundMusic.play().catch((error) => {
              console.log("🚨 Erreur de lecture :", error);
            });
            timerStarted = true;
          }
        }
  
        // Initialize AnimationManager
        let playerElement = document.getElementById('player');
  
        function formatTime(ms) {
            const minutes = Math.floor(ms / 60000);
            const seconds = Math.floor((ms % 60000) / 1000);
            const milliseconds = Math.floor((ms % 1000) / 10);
            return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        }
  
        let cameraX = 0;
        let cameraY = 0;
  
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
  
        const keysPressed = {};
  
        window.addEventListener("keydown", (event) => {
            keysPressed[event.code] = true;
            if (event.code === "Space" || event.code === "ArrowUp") {
                player.jump();
            }
            if (event.code === "ArrowRight") {
            }
        });
  
        window.addEventListener("keyup", (event) => {
            delete keysPressed[event.code];
        });
  
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
            coins = coins.filter(coin => {
                const adjustedCoinX = coin.x - cameraX;
                const adjustedPlayerX = player.x;
                if (
                    adjustedPlayerX < coin.x + coin.radius &&
                    adjustedPlayerX + player.width > coin.x - coin.radius &&
                    player.y < coin.y + coin.radius &&
                    player.y + player.height > coin.y - coin.radius
                ) {
                    player.collectCoin();
                    return false;
                }
                return true;
            });
        }
  
        function resetClées() {
            clée = createClées(canvas);
        }
        
        function checkCléeCollisions() {
            clée = clée.filter(clée => {
                const adjustedKcléeX = clée.x - cameraX;
                const adjustedPlayerX = player.x;
                if (
                    adjustedPlayerX < clée.x + clée.radius &&
                    adjustedPlayerX + player.width > clée.x - clée.radius &&
                    player.y < clée.y + clée.radius &&
                    player.y + player.height > clée.y - clée.radius
                ) {
                    player.collectclée();
                    return false;   
                }
                return true;
            });
        }
  
        function checkEnemyCollisions() {
            enemies.forEach(enemy => {
                const adjustedEnemyX = enemy.x - cameraX;
                const adjustedPlayerX = player.x;
                if (
                    adjustedPlayerX < enemy.x + enemy.width &&
                    adjustedPlayerX + player.width > enemy.x &&
                    player.y < enemy.y + enemy.height &&
                    player.y + player.height > enemy.y
                ) {
                    player.die(enemies, triggerZones, canvas);
                    resetClées();
                }
            });
        }
  
        function checkDoorCollisions() {
            doors.forEach(door => {
                const playerBox = {
                    x: player.x- cameraX,
                    y: player.y,
                    width: player.width,
                    height: player.height
                };
                
                const doorBox = {
                    x: door.x - cameraX,
                    y: door.y ,
                    width: door.width,
                    height: door.height
                };
        
                if (
                    playerBox.x < doorBox.x + doorBox.width + 10 &&
                    playerBox.x + playerBox.width > doorBox.x - 10 &&
                    playerBox.y < doorBox.y + doorBox.height &&
                    playerBox.y + playerBox.height > doorBox.y
                ) {
                    door.open(player);
                }
            });
        }
  
        function moveAllEnemies() {
            enemies.forEach(enemy => {
                if (enemy instanceof MovingEnemy) {
                    enemy.movE();
                } else if (enemy instanceof RoundEnemy) {
                    enemy.update();
                }
            });
        }
  
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
  
            if (!isGameWon) {
                gameTime = Date.now() - startTime;
                startMusicWhenTimerStarts(); // Lancer la musique lorsque le chronomètre démarre
            }
  
            cameraX = player.x - canvas.width / 2 + player.width / 2;
            cameraY = player.y - canvas.height / 2 + player.height / 2;
  
            cameraX = Math.max(0, cameraX);
            cameraY = Math.max(0, Math.min(cameraY, canvas.height - player.height));
  
            ctx.save();
            ctx.translate(-cameraX, -cameraY);
  
            platforms.forEach(platform => platform.draw(ctx));
            coins.forEach(coin => coin.draw(ctx));
            clée.forEach(clée => clée.draw(ctx));
            enemies.forEach(enemy => enemy.draw(ctx));
            doors.forEach(door => door.draw(ctx));
            victoryZone.draw(ctx);
            player.draw(ctx);
  
            ctx.restore();
  
            if (!isGameWon) {
                updatePlayerMovement();
                player.update(platforms, doors);
                moveAllEnemies();
  
                if (victoryZone.checkVictory(player)) {
                    isGameWon = true;
                }
  
                checkCoinCollisions();
                checkEnemyCollisions();
                checkCléeCollisions();
                checkDoorCollisions();
            }
  
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText(`Temps: ${formatTime(gameTime)}`, 10, 30);
            ctx.fillText(`Pièces: ${player.coins}`, 10, 55);
            ctx.fillText(`Clées: ${player.clées}`, 10, 80);
            ctx.fillText(`Morts: ${player.deathCount}`, 10, 105);
  
            if (triggerZones) {
                triggerZones.forEach(zone => {
                    if (zone.checkTrigger(player)) {
                        enemies.push(zone.enemy);
                    }
                });
            }
  
            if (isGameWon) {
                ctx.fillStyle = "green";
                ctx.font = "40px Arial";
                ctx.fillText("Victoire !", canvas.width/2 - 80, canvas.height/2);
                ctx.font = "30px Arial";
                ctx.fillText(`Temps final: ${formatTime(gameTime)}`, canvas.width/2 - 100, canvas.height/2 + 40);
            }
  
            requestAnimationFrame(gameLoop);
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
  
        window.addEventListener("keydown", (event) => {
            if (event.code === "KeyR") {
                resetGame();
            }
        });
  
        gameLoop();
    } else {
        console.error("Background music not found");
    }
  };
  
