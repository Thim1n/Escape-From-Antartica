const { createSecureContext } = require("tls");

window.onload = function () {
    // 1. Initialisation du canvas
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 2. Initialisation des éléments du jeu
    const platforms = createPlatforms(canvas);
    const player = new Player(20, canvas.height - 20 - 50);
    let coins = createCoins(canvas);
    let enemies = createEnemies(canvas);
    let triggerZones = createTriggerZones(canvas); 
    let startTime = Date.now();
    let isGameWon = false;
    let gameTime = 0;
    
    // Créer la zone de victoire (ajustez la position selon votre niveau)
    const victoryZone = new VictoryZone(1850, canvas.height - 100);

    // Fonction pour formater le temps en minutes:secondes.millisecondes
    function formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    // 3. Variables pour la caméra
    let cameraX = 0;
    let cameraY = 0;

    // 4. Gestion du redimensionnement
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 5. Gestion des contrôles
    const keysPressed = {};

    window.addEventListener("keydown", (event) => {
        keysPressed[event.code] = true;
        if (event.code === "Space" || event.code === "ArrowUp") {
            player.jump();
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

    // 6. Fonctions de gestion des collisions
    function checkCoinCollisions() {
        coins = coins.filter(coin => {
            // Ajuster les positions en fonction de la caméra pour la détection des collisions
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

    function checkEnemyCollisions() {
        enemies.forEach(enemy => {
            // Ajuster les positions en fonction de la caméra pour la détection des collisions
            const adjustedEnemyX = enemy.x - cameraX;
            const adjustedPlayerX = player.x;
            if (
                adjustedPlayerX < enemy.x + enemy.width &&
                adjustedPlayerX + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                player.die(enemies, triggerZones);
            }
        });
    }

    function moveAllEnemies() {
        enemies.forEach(enemy => {
            if (enemy instanceof MovingEnemy) {
                enemy.movE();  // Déplace uniquement les ennemis mobiles classiques
            } else if (enemy instanceof RoundEnemy) {
                enemy.update();  // Déplace l'ennemi rond
            }
        });
    }
    

    // 7. Boucle principale du jeu
    function gameLoop() {
        // Effacement du canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mise à jour du chronomètre si le jeu n'est pas terminé
        if (!isGameWon) {
            gameTime = Date.now() - startTime;
        }
        // Mise à jour de la caméra
        cameraX = player.x - canvas.width / 2 + player.width / 2;
        cameraY = player.y - canvas.height / 2 + player.height / 2;

        // Limites de la caméra
        cameraX = Math.max(0, cameraX);
        cameraY = Math.max(0, Math.min(cameraY, canvas.height - player.height));

        // Sauvegarde du contexte pour la transformation
        ctx.save();
        
        // Application du décalage de la caméra
        ctx.translate(-cameraX, -cameraY);

        // Dessin des éléments
        platforms.forEach(platform => platform.draw(ctx));
        coins.forEach(coin => coin.draw(ctx));
        enemies.forEach(enemy => enemy.draw(ctx));
        victoryZone.draw(ctx);  // Dessiner la zone de victoire
        player.draw(ctx);

        // Restauration du contexte
        ctx.restore();

        // Mise à jour des états
        if (!isGameWon) {
            updatePlayerMovement();
            player.update(platforms);
            moveAllEnemies();

            // Vérification de la victoire
            if (victoryZone.checkVictory(player)) {
                isGameWon = true;
                vicotryAPI();
                // Vous pouvez ajouter ici d'autres actions pour la victoire
            }

            // Vérification des collisions
            checkCoinCollisions();
            checkEnemyCollisions();
        }

        // Interface utilisateur (score, chrono, etc.)
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Temps: ${formatTime(gameTime)}`, 10, 30);
        ctx.fillText(`Pièces: ${player.coins}`, 10, 55);
        ctx.fillText(`Morts: ${player.deathCount}`, 10, 80);

               // Gestion des zones de déclenchement
        if (triggerZones) {
            triggerZones.forEach(zone => {
                if (zone.checkTrigger(player)) {
                    enemies.push(zone.enemy);
                }
            });
        }

        // Afficher message de victoire si le jeu est gagné
        if (isGameWon) {
            ctx.fillStyle = "green";
            ctx.font = "40px Arial";
            ctx.fillText("Victoire !", canvas.width/2 - 80, canvas.height/2);
            ctx.font = "30px Arial";
            ctx.fillText(`Temps final: ${formatTime(gameTime)}`, canvas.width/2 - 100, canvas.height/2 + 40);
        }

        // Appel de la prochaine frame
        requestAnimationFrame(gameLoop);
    }

    // Fonction pour redémarrer le jeu
    function resetGame() {
        startTime = Date.now();
        isGameWon = false;
        gameTime = 0;
        player.x = player.startX;
        player.y = player.startY;
        player.coins = 0;
        player.deathCount = 0;
        victoryZone.reset();
        // Réinitialiser d'autres éléments si nécessaire
    }

    // Ajouter un écouteur pour la touche R pour redémarrer
    window.addEventListener("keydown", (event) => {
        if (event.code === "KeyR") {
            resetGame();
        }
    });

function getPlayerID() {
    const PLAYERNAME = localStorage.getItem("playerName");
    const data = {
        name: PLAYERNAME
    }
    const playerID = fetch("/getplayerid",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    then(response => response.json())
    .then(result => {
        console.log(result);
        return result.id;
});
}

function vicotryAPI() {
    currentPlayerID = getPlayerID() ;

    // Envoi du score et du temps à l'API
    const data = {
        score: player.coins,
        userId: createSecureContext,  // Remplacez par l'ID de l'utilisateur actuel
        time: gameTime
    };

    fetch("/addgame", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi des données de jeu", error);
        });
}

    // Démarrage du jeu
    gameLoop();
};