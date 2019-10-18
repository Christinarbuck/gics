export default class Food
{
	constructor(game)
	{
		this.blockColor = "lemonchiffon";
		this.borderColor = "yellow";
		this.x;
		this.y;
		this.game = game;
		this.width = game.BLOCK_SIZE;
		this.height = game.BLOCK_SIZE;
		this.respawn();
	}// end constructor

	getX() { return this.x; }

	getY() { return this.y; }

	setBlockColor(newColor) { this.blockColor = newColor; }
	
	randSizeMultiple(min, max)
	{
		return Math.round((Math.random() * (max - min) + min) / 
		this.game.BLOCK_SIZE) * this.game.BLOCK_SIZE;
	}

	respawn()
	{
		this.x = this.randSizeMultiple(0, this.game.getGameWidth() - this.game.BLOCK_SIZE);
		this.y = this.randSizeMultiple(0, this.game.getGameHeight() - this.game.BLOCK_SIZE);
		if (this.x > this.game.getGameWidth() || this.y > this.game.getGameHeight())
		{
			this.respawn();
		}
	}

	update()
	{}// end method

	draw(ctx)
	{
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = this.blockColor;
		ctx.strokeStyle = this.borderColor;
		ctx.fill();
		ctx.stroke();
	}// end method
}// end class