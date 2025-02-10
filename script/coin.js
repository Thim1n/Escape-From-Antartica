// Fichier coin.js
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
    }

    draw(ctx) {
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createCoins(canvas) {
    return [
    ];
}


class Clée extends Coin {
    constructor(x, y) {
      super(x, y);
      // Charger l'image qui servira de sprite pour la clé
      this.image = new Image();
      // Chemin relatif à partir de votre fichier HTML (utilisez "/" et non "\")
      this.image.src = "../assets/sprite/Clée.png";
      // Définissez la largeur et la hauteur selon vos besoins
      this.width = 80;
      this.height = 80  ;
    }
  
    // Méthode draw qui affiche l'image sur le canvas
    draw(ctx) {
      // Vous pouvez ajouter une vérification pour s'assurer que l'image est chargée
      if (this.image.complete) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    }
  }
  
  function createClées(canvas) {
    return [
        new Clée(300, canvas.height - 50),

    ];
  }
  

