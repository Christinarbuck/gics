import DirEnum from "./dirEnum.js";
import BodyPart from "./BodyPart.js"

export default class Snake
{
	constructor(id, x, y, game)
	{
		this.snakeID = id;
		this.blockColor = "green";
		this.borderColor = "white";
		this.gameSpeedIncrement = 1;
		this.game = game;
		this.isChangingDirection = false;
		this.width = this.game.BLOCK_SIZE;
		this.height = this.game.BLOCK_SIZE;
		this.dirEnum = new DirEnum(this.width);
		this.direction = this.dirEnum.DIR.DOWN;
		this.body = [ 
			new BodyPart(x, y),
			new BodyPart(x, y - this.height),
			new BodyPart(x, y - (2 * this.height))
		];
		this.powerup = 0;
		this.poweruptimer = 0;
		this.alive = true;
		// [150, 50, DIR.RIGHT], [120, 50, DIR.RIGHT]

	}// end constructor

	getWidth() { return this.width; }// end method

	getHeight() { return this.height; }// end method

	getDirection() { return this.direction; }// end method

	getDirEnum() { return this.DirEnum; }// end method

	IsChangingDirection() { return this.isChangingDirection; }

	kill() { this.alive = false; }

	isDead() { return !this.alive; }
	
	isOffScreen() { return this.body[0].x < 0 || this.body[0].x >= this.game.getGameWidth() ||
		this.body[0].y < 0 || this.body[0].y >= this.game.getGameHeight(); }

	isAboutToEat()
	{  
		let aboutToEat = false;
		this.game.getFoodObjects().forEach(element => 
		{
			if ( this.body[0].x + this.direction[0] === element.getX()
			&& this.body[0].y + this.direction[1] === element.getY())
			{
				// Check food power
				if(element.foodtype == 1) {
					this.powerup = 1;
					this.poweruptimer = 20;
				}
				element.respawn();
				this.game.checkFoodAmount();
				aboutToEat = true;
			}
		});
		return aboutToEat;
	}

	willTouchAnySnake(direction)
	{
		let aboutToTouch = false;
		this.game.snakeObjects.forEach(snake => {
			if(this.willTouchSnake(direction, snake)) {
				aboutToTouch = true;
			}
		});
		return aboutToTouch;
	}

	willTouchSnake(direction, snake)
	{
		let aboutToTouch = false;
		snake.body.forEach(element => 
		{
			if ( this.body[0].x + direction[0] === element.x
				&& this.body[0].y + direction[1] === element.y)
			{
				aboutToTouch = true;
			}
		});
		return aboutToTouch;
	}

	bounce()
	{
		let option1 = this.dirEnum.DIR.DOWN;
		let option2 = this.dirEnum.DIR.UP;

		if(this.direction == this.dirEnum.DIR.DOWN || this.direction
			== this.dirEnum.DIR.UP)
		{
			option1 = this.dirEnum.DIR.LEFT;
			option2 = this.dirEnum.DIR.RIGHT;
		}
		// Check if one direction is impossible
		if(this.willTouchAnySnake(option1)) {
			// If both directions are impossible, game over!
			if(this.willTouchAnySnake(option2)) {
				this.game.gameOver(this);
			} else {
				this.direction = option2;
			}
		} else if(this.willTouchAnySnake(option2)) {
			this.direction = option1;
		} else {
			// Just choose a random direction
			if(Math.round(Math.random()) == 1) {
				this.direction = option1;
			} else {
				this.direction = option2;
			}
		}
	}

	setBlockColor(newColor) { this.blockColor = newColor; }

	setBorderColor(newColor) { this.borderColor = newColor; }

	setWidth(width) { this.width = width; }// end method

	setHeight(height) { this.height = height; }// end method

	setDirection(direction) { this.direction = direction; }// end method

	setIsChangingDirection(value) { this.isChangingDirection = value; }
	
	reset(x, y) { 
		this.alive = true;
		this.body = [ 
			new BodyPart(x, y),
			new BodyPart(x, y - this.height),
			new BodyPart(x, y - (2 * this.height))
		];
		this.direction = this.dirEnum.DIR.DOWN;
		this.poweruptimer = 0;
		this.powerup = 0;
	}

	update()
	{
		if(this.alive) {
			this.setIsChangingDirection(false);
			if (this.isOffScreen())
			{
				this.game.gameOver(this);
				return;
			}
			this.game.snakeObjects.forEach(element => {
				console.log("Checking snake");
				if (this.willTouchSnake(this.direction, element)) {
					if(element.snakeID == this.snakeID) {
						this.game.gameOver(this);
						return;
					} else {
						if(element.powerup == 1) {
							this.game.gameOver(this);
							return;
						}
						else {
							this.bounce();
						}
					}
				}
			});
			if (this.isAboutToEat())
			{
				this.body.push(new BodyPart(this.body[this.body.length - 1].x,
					this.body[this.body.length - 1].y))
				this.game.increaseScore(this.snakeID)
			}
			// Tick down powerup timer
			if(this.poweruptimer > 0) {
				this.poweruptimer--;
				if(this.poweruptimer == 0)
					this.powerup = 0;
			}
			// advance snake
			this.body.pop();
			this.body.unshift(new BodyPart(this.body[0].x + this.direction[0], 
				this.body[0].y + this.direction[1]) )
		}
	}// end method

	draw(ctx)
	{
		ctx.beginPath();
		ctx.fillStyle =  this.blockColor;
		ctx.strokeStyle = this.borderColor;
		if(!this.alive) {
			ctx.fillStyle =  "gray";
			ctx.strokeStyle = "darkgray";
		}

		for (let i = 0; i < this.body.length; i++)
		{
			ctx.rect(this.body[i].x, this.body[i].y, this.width, this.height);
		}
		ctx.fill();
		ctx.stroke();
		if(this.powerup == 1) {
			this.drawSpikes(ctx);
		}
	}// end method

	drawSpikes(ctx)
	{
		for (let i = 1; i < this.body.length; i++)
		{
			let openLeft = true;
			let openRight = true;
			let openUp = true;
			let openDown = true;
			// Don't put spikes in the direction of the block before this one
			if(this.body[i-1].x < this.body[i].x) openLeft = false;
			if(this.body[i-1].x > this.body[i].x) openRight = false;
			if(this.body[i-1].y < this.body[i].y) openUp = false;
			if(this.body[i-1].y > this.body[i].y) openDown = false;

			if(i < this.body.length-1)
			{
				if(this.body[i+1].x < this.body[i].x) openLeft = false;
				if(this.body[i+1].x > this.body[i].x) openRight = false;
				if(this.body[i+1].y < this.body[i].y) openUp = false;
				if(this.body[i+1].y > this.body[i].y) openDown = false;
			}

			let SPIKE_NUM=3;
			// Draw all open slots
			if(openLeft) {
				ctx.moveTo(this.body[i].x, this.body[i].y);
				for(let spike = 1; spike <= SPIKE_NUM; spike++) {
					ctx.lineTo(this.body[i].x-this.game.BLOCK_SIZE/3, this.body[i].y+(this.game.BLOCK_SIZE*spike)/(SPIKE_NUM*2));
					ctx.lineTo(this.body[i].x, this.body[i].y+this.game.BLOCK_SIZE*spike/SPIKE_NUM);
				}
				ctx.lineTo(this.body[i].x, this.body[i].y);
			}
			if(openRight) {
				ctx.moveTo(this.body[i].x+this.game.BLOCK_SIZE, this.body[i].y);
				for(let spike = 1; spike <= SPIKE_NUM; spike++) {
					ctx.lineTo(this.body[i].x+this.game.BLOCK_SIZE+this.game.BLOCK_SIZE/3, this.body[i].y+(this.game.BLOCK_SIZE*spike)/(SPIKE_NUM*2));
					ctx.lineTo(this.body[i].x+this.game.BLOCK_SIZE, this.body[i].y+this.game.BLOCK_SIZE*spike/SPIKE_NUM);
				}
				ctx.lineTo(this.body[i].x+this.game.BLOCK_SIZE, this.body[i].y);
			}
			if(openUp) {
				ctx.moveTo(this.body[i].x, this.body[i].y);
				for(let spike = 1; spike <= SPIKE_NUM; spike++) {
					ctx.lineTo(this.body[i].x+(this.game.BLOCK_SIZE*spike)/(SPIKE_NUM*2), this.body[i].y-this.game.BLOCK_SIZE/3);
					ctx.lineTo(this.body[i].x+this.game.BLOCK_SIZE*spike/SPIKE_NUM, this.body[i].y);
				}
				ctx.lineTo(this.body[i].x, this.body[i].y);
			}
			if(openDown) {
				ctx.moveTo(this.body[i].x, this.body[i].y+this.game.BLOCK_SIZE);
				for(let spike = 1; spike <= SPIKE_NUM; spike++) {
					ctx.lineTo(this.body[i].x+(this.game.BLOCK_SIZE*spike)/(SPIKE_NUM*2), this.body[i].y+this.game.BLOCK_SIZE+this.game.BLOCK_SIZE/3);
					ctx.lineTo(this.body[i].x+this.game.BLOCK_SIZE*spike/SPIKE_NUM, this.body[i].y+this.game.BLOCK_SIZE);
				}
				ctx.lineTo(this.body[i].x, this.body[i].y+this.game.BLOCK_SIZE);
			}
		}
		ctx.fill();
		ctx.stroke();
	}
}// end class