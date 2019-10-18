import SnakeGame from "./snakeGame.js";
// initialize vars
let cvs = document.getElementsByClassName("cvs")[0];
// this is the context, it's an attribute of the canvas
// whose methods we can use to draw graphics
let ctx = cvs.getContext("2d");
let snakeGame = new SnakeGame(cvs.width, cvs.height);
let counter = 0; let timer = 0;
let FRAME_LENGTH = 30;
snakeGame.initialize();
// the main game loop
function gameLoop(timeStamp)
	{
		counter++;
		if(counter % Math.round(snakeGame.getGameSpeed()/3) == 0) {
			counter = 0;
			snakeGame.update();
			snakeGame.draw(ctx);

			if(snakeGame.resetCount > 0 && snakeGame.gameOvered == false) {
				drawTimer(ctx)
			}
		}

		timer++;
		if(timer == Math.round(1000/FRAME_LENGTH)) {
			timer = 0;
			if(snakeGame.resetCount > 0) {
				snakeGame.resetCount--;
				if(snakeGame.resetCount == 0) {
					snakeGame.reset()
				}
			}
		}
	}// end method
	// tells the browser to call this function right before every render of the page occurs
	// requestAnimationFrame(gameLoop);
	
function drawTimer(ctx)
	{
		// Draw end timer
		if(snakeGame.resetCount > 0) {
			ctx.strokeStyle = "black";
			ctx.font = "60px Arial";
			ctx.strokeText(snakeGame.resetCount, snakeGame.gameWidth/2, snakeGame.gameHeight/2); 
		}
	}// end method

setInterval(gameLoop, FRAME_LENGTH);