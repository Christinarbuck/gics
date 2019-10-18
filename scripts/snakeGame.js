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
		this.backgroundColor = "lightblue";
		this.gameSpeed = 28;
		this.score = [];
		this.BLOCK_SIZE = 40;
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;
		this.gameObjects = [];
		this.snakeObjects = [];
		this.foodObjects = [];
		this.resetCount = 0;
	}// end constructor

	initialize()
	{
		
		const SNAKE_COLOUR_1 = 'darkseagreen';
		const SNAKE_BORDER_COLOUR_1 = 'green';
		const SNAKE_COLOUR_2 = 'coral';
		const SNAKE_BORDER_COLOUR_2 = 'brown';
			
		this.player1 = new Snake(1, 400, 40, this);
		this.player1.setBlockColor(SNAKE_COLOUR_1);
		this.player1.setBorderColor(SNAKE_BORDER_COLOUR_1);
		this.score.push(0)

		this.player2 = new Snake(2, 40, 40, this);
		this.player2.setBlockColor(SNAKE_COLOUR_2);
		this.player2.setBorderColor(SNAKE_BORDER_COLOUR_2);
		this.score.push(0)

		this.food = new Food(this);

		new InputHandler(this.player1, this.KEYS.LEFT_ARROW, this.KEYS.RIGHT_ARROW, 
			this.KEYS.UP_ARROW, this.KEYS.DOWN_ARROW);
		new InputHandler(this.player2, this.KEYS.A, this.KEYS.D, 
			this.KEYS.W, this.KEYS.S);

		this.gameObjects.push(this.player1, this.player2, this.food);
		this.snakeObjects.push(this.player1, this.player2);
		this.foodObjects.push(this.food);
	}// end method

	getGameWidth() { return this.gameWidth; }

	getGameHeight() { return this.gameHeight; }

	getFoodObjects() { return this.foodObjects; }

	getTotalScore() {
		let total = 0;
		this.score.forEach(element => {
			total = total + element;
		});
		return total;
	}

	getGameSpeed() { return this.gameSpeed - this.getTotalScore(); }

	increaseScore(snakeID) {
		this.score[snakeID-1]++;
        document.getElementById('p'+snakeID).innerHTML = this.score[snakeID-1]*10;
	}

	checkFoodAmount()
	{
		if(this.getTotalScore() > this.foodObjects.length*10) {
			// On successful respawn, check score to see if we need to add an extra food
			var newFood = new Food(this);
			this.foodObjects.push(newFood);
			this.gameObjects.push(newFood);
		}
	}

	gameOver(snake) {
		snake.kill()
		// Just kill one snake if other snakes are still alive
		let playersLeft = false;
		this.snakeObjects.forEach(element => {
			if(!element.isDead()) playersLeft = true;
		});

		if(!playersLeft) {
			// Make speed of reset fast if the game had not progressed much at all,
			// but slow if the game had gone on very long, so players with long games
			// can appreciate their giant snakes
			this.resetCount = this.getTotalScore()+1;
			for (let i = 0; i < this.score.length; i++) {
				this.score[i] = 20;
			}
		}
	}
	
	reset()
	{
		for (let i = 0; i < this.score.length; i++) {
			this.score[i] = 0;
			document.getElementById('p'+(i+1)).innerHTML = this.score[i]*10;
		}
		this.player1.reset(this.BLOCK_SIZE, this.BLOCK_SIZE*3);
		this.player2.reset(this.gameWidth - this.BLOCK_SIZE*4, this.BLOCK_SIZE*3);
		this.food.respawn();
		this.gameObjects = [this.player1, this.player2, this.food];
		this.foodObjects = [this.food];
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