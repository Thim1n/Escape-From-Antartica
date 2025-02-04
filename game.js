window.onload = function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // ✅ Fonction pour ajuster la taille du canvas et du sol
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // ✅ Met à jour la plateforme du sol
        platforms[0] = new Platform(0, canvas.height - 20, canvas.width, 20);
    }

    // ✅ Création du joueur, ennemis et pièces
    let player = new Player(50, 500);
    let enemy = new Enemy(700, 500);
    let coins = [new Coin(200, 400), new Coin(400, 300)];

    // ✅ Création des plateformes
    let platforms = createPlatforms(canvas);

    // ✅ Ajuster la taille au chargement et lors du redimensionnement
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const keysPressed = {}; // Objet pour stocker les touches enfoncées

    window.addEventListener("keydown", (event) => {
        keysPressed[event.code] = true; // Enregistrer la touche pressée

        console.log("Touche pressée :", event.code);

        if (event.code === "Space") {
            player.jump();
        }
        updateMovement(); // Met à jour le mouvement selon les touches enfoncées
    });

    window.addEventListener("keyup", (event) => {
        delete keysPressed[event.code]; // Supprimer la touche relâchée

        updateMovement(); // Vérifier quelle touche est encore enfoncée
    });

    // ✅ Fonction qui met à jour le mouvement du joueur
    function updateMovement() {
        if (keysPressed["KeyA"] || keysPressed["KeyQ"]) { // AZERTY & QWERTY
            player.moveLeft();
        } else if (keysPressed["KeyD"]) {
            player.moveRight();
        } else {
            player.stop();
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        platforms.forEach(platform => platform.draw(ctx));
        coins.forEach(coin => coin.draw(ctx));
        enemy.draw(ctx);
        player.update(platforms);
        player.draw(ctx);

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
};

// ✅ Fonction pour créer les plateformes
function createPlatforms(canvas) {
    return [
        new Platform(0, canvas.height - 20, canvas.width, 20), // ✅ Sol pleine largeur
        new Platform(200, canvas.height - 100, 150, 10),
        new Platform(400, canvas.height - 200, 150, 10),
        new Platform(600, canvas.height - 300, 150, 10),
        new Platform(850, canvas.height - 400, 150, 10),
        new Platform(1100, canvas.height - 500, 150, 10),
        new Platform(1300, canvas.height - 600, 150, 10),
        new Platform(1600, canvas.height - 300, 150, 10),
        new Platform(1900, canvas.height - 100, 150, 10),
    ];
}
