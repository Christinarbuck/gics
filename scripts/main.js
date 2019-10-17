import SnakeGame from "./snakeGame.js";
// initialize vars
let cvs = document.getElementsByClassName("cvs")[0];
// this is the context, it's an attribute of the canvas
// whose methods we can use to draw graphics
let ctx = cvs.getContext("2d");
let snakeGame = new SnakeGame(cvs.width, cvs.height);
let counter = 0;
snakeGame.initialize();
// the main game loop
function gameLoop(timeStamp)
	{
		counter++;
		if(counter % Math.round(snakeGame.getGameSpeed()/2) == 0) {
			counter = 0;
			snakeGame.update();
			snakeGame.draw(ctx);
		}
	}// end method
	// tells the browser to call this function right before every render of the page occurs
	// requestAnimationFrame(gameLoop);
setInterval(gameLoop, 30);