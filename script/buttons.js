// Fichier button.js

class Button {
	constructor(x, y, width, height, text) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text;
	}

	draw(ctx) {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.font = "20px Arial";
		ctx.fillText(this.text, this.x + 10, this.y + 30);
	}
}
