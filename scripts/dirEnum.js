export default class DirEnum
{
	constructor(movementUnits)
	{
		this.DIR = {
			UP: [0, -movementUnits], 
			DOWN: [0, movementUnits], 
			LEFT: [-movementUnits, 0], 
			RIGHT: [movementUnits, 0]
		}
	}// end constructor
}// end class
