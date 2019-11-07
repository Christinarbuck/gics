export default class Food
{
	constructor(game)
	{
		this.blockColor = "lemonchiffon";
		this.borderColor = "yellow";

		this.spikeColor = "yellow";
		this.spikeBorderColor = "gold";
		this.x;
		this.y;
		this.game = game;
		this.width = game.BLOCK_SIZE;
		this.height = game.BLOCK_SIZE;
		this.respawn();
		this.foodtype = 0;
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
		} else if(this.wouldTouchSnake()) {
			this.respawn();
		} else { // This food is in a valid position. Check if power-food
			let randPow = Math.random() * 10;
			if(randPow <= 1) {
				this.foodtype = 1; // Spike power food
			} else {
				this.foodtype = 0;
			}
		}
	}

	wouldTouchSnake()
	{
		let aboutToTouch = false;
		this.game.snakeObjects.forEach(snake => {
			snake.body.forEach(element => 
			{
				if ( this.x === element.x && this.y === element.y)
				{
					aboutToTouch = true;
				}
			});
		});
		return aboutToTouch;
	}

	update()
	{}// end method

	draw(ctx)
	{
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		if(this.foodtype == 0) {
			ctx.fillStyle = this.blockColor;
			ctx.strokeStyle = this.borderColor;
		} else {
			ctx.fillStyle = this.spikeColor;
			ctx.strokeStyle = this.spikeBorderColor;
		}
		ctx.fill();
		ctx.stroke();
	}// end method
}// end class