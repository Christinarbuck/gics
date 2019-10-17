import InputHandler from "./inputHandler.js";
import Snake from "./snake.js";
import Food from "./food.js";

export default class SnakeGame
{
	constructor(gameWidth, gameHeight)
	{
		this.KEYS = {
			LEFT_ARROW: 37, 
			UP_ARROW: 38, 
			RIGHT_ARROW: 39, 
			DOWN_ARROW: 40,
			W: 87,
			A: 65,
			S: 83,
			D: 68
		};
		this.backgroundColor = "green";
		this.gameSpeed = 30;
		this.score = 0;
		this.BLOCK_SIZE = 40;
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;
		this.gameObjects = [];
		this.foodObjects = [];
		this.resetCount = 0;
	}// end constructor

	initialize()
	{
		this.player1 = new Snake(400, 40, this);
		this.player1.setBlockColor("blue");
		this.player2 = new Snake(40, 40, this);
		this.player2.setBlockColor("red");
		this.food = new Food(this);
		new InputHandler(this.player1, this.KEYS.LEFT_ARROW, this.KEYS.RIGHT_ARROW, 
			this.KEYS.UP_ARROW, this.KEYS.DOWN_ARROW);
		new InputHandler(this.player2, this.KEYS.A, this.KEYS.D, 
			this.KEYS.W, this.KEYS.S);
		this.gameObjects.push(this.player1, this.player2, this.food);
		this.foodObjects.push(this.food);
	}// end method

	getGameWidth() { return this.gameWidth; }

	getGameHeight() { return this.gameHeight; }

	getGameSpeed() { return this.gameSpeed - this.score; }

	getFoodObjects() { return this.foodObjects; }

	setGameSpeed(newSpeed) {
		if(newSpeed > 1) {
			this.score = this.gameSpeed - newSpeed;
		}
	}

	gameOver() {
		// Make speed of reset fast if the game had not progressed much at all,
		// but slow if the game had gone on very long, so players with long games
		// can appreciate their giant snakes
		this.resetCount = this.score;
		this.score = 20;
	}
	
	reset()
	{
		this.score = 0;
		this.player1.reset(40, 40);
		this.player2.reset(400, 40);
		this.food.respawn();
	}

	update()
	{
		if(this.resetCount <= 0) {
			this.gameObjects.forEach(element => {
				element.update();
			});
		} else {
			this.resetCount--;
			if(this.resetCount == 0) {
				this.reset();
			}
		}
	}// end method

	draw(ctx)
	{
		ctx.clearRect(0, 0, this.gameWidth, this.gameHeight); 
		ctx.fillStyle = this.backgroundColor;
		ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
		this.gameObjects.forEach(element => {
			element.draw(ctx);
		});
	}// end method
}// end class