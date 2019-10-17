import DirEnum from "./dirEnum.js";
import BodyPart from "./BodyPart.js"

export default class Snake
{
	constructor(x, y, game)
	{
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
		// [150, 50, DIR.RIGHT], [120, 50, DIR.RIGHT]

	}// end constructor

	getWidth() { return this.width; }// end method

	getHeight() { return this.height; }// end method

	getDirection() { return this.direction; }// end method

	getDirEnum() { return this.DirEnum; }// end method

	IsChangingDirection() { return this.isChangingDirection; }
	
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
				element.respawn();
				aboutToEat = true;
			}
		});
		return aboutToEat;
	}

	setBlockColor(newColor) { this.blockColor = newColor; }

	setBorderColor(newColor) { this.borderColor = newColor; }

	setWidth(width) { this.width = width; }// end method

	setHeight(height) { this.height = height; }// end method

	setDirection(direction) { this.direction = direction; }// end method

	setIsChangingDirection(value) { this.isChangingDirection = value; }
	
	reset(x, y) { 
		this.body = [ 
			new BodyPart(x, y),
			new BodyPart(x, y - this.height),
			new BodyPart(x, y - (2 * this.height))
		];
		this.direction = this.dirEnum.DIR.DOWN;
	}

	update()
	{
		this.setIsChangingDirection(false);
		if (this.isOffScreen())
		{
			this.game.gameOver();
		}
		if (this.isAboutToEat())
		{
			this.body.push(new BodyPart(this.body[this.body.length - 1].x,
				this.body[this.body.length - 1].y))
			console.log(this.game.getGameSpeed())
			this.game.setGameSpeed(this.game.getGameSpeed() - this.gameSpeedIncrement);
		}
		// advance snake
		this.body.pop();
		this.body.unshift(new BodyPart(this.body[0].x + this.direction[0], 
			this.body[0].y + this.direction[1]) )
	}// end method

	draw(ctx)
	{
		ctx.beginPath();
		for (let i = 0; i < this.body.length; i++)
		{
			ctx.rect(this.body[i].x, this.body[i].y, this.width, this.height);
		}
		ctx.fillStyle =  this.blockColor;
		// ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
		ctx.strokeStyle = this.borderColor;
		ctx.fill();
		ctx.stroke();
	}// end method
}// end class