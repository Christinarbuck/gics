export default class InputHandler
{
	constructor(snake, LEFT, RIGHT, UP, DOWN)
	{
		document.addEventListener("keydown", (event) => 
		{
			if (snake.isChangingDirection == true) { return; }
			//snake.setIsChangingDirection(true);
			switch (event.keyCode) 
			{
			case LEFT:
				if(snake.getDirection() != snake.dirEnum.DIR.RIGHT)
					//console.log(snake);
					snake.setDirection(snake.dirEnum.DIR.LEFT);
				break;
			case RIGHT:
				if(snake.getDirection() != snake.dirEnum.DIR.LEFT) 
					snake.setDirection(snake.dirEnum.DIR.RIGHT);
				break;
			case UP:
				if(snake.getDirection() != snake.dirEnum.DIR.DOWN) 
					snake.setDirection(snake.dirEnum.DIR.UP);
				break;
			case DOWN:
				if(snake.getDirection() != snake.dirEnum.DIR.UP) 
					snake.setDirection(snake.dirEnum.DIR.DOWN);
				break;
			default:
				break;
			}
		});
	}// end constructor
}// end class