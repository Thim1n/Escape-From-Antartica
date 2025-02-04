window.onload = function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const platforms = createPlatforms(canvas);
    const player = new Player(20, canvas.height - 20 - 50);

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
    let coins = createCoins(canvas);
    const enemy = new Enemy(600, canvas.height - 70);


    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updatePlayerMovement();


    
        platforms.forEach(platform => platform.draw(ctx));
        coins.forEach(coin => coin.draw(ctx));
        


        enemy.draw(ctx);
        enemy.checkCollision(player);

        player.update(platforms);
        player.draw(ctx);
    
        checkCoinCollisions();
    
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`Pièces : ${player.coins}`, 10, 30);

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(`mort : ${player.deathCount}`, 10, 50);    
        requestAnimationFrame(gameLoop);
    }

    function checkCoinCollisions() {
        coins = coins.filter(coin => {
            if (
                player.x < coin.x + coin.radius &&
                player.x + player.width > coin.x - coin.radius &&
                player.y < coin.y + coin.radius &&
                player.y + player.height > coin.y - coin.radius
            ) {
                player.collectCoin();
                return false;
            }
            return true;
        });
    }

    gameLoop();
};
