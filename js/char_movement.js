var running = false;		//bestimmt ob gerade eine Animation ausgeführt wird
var move_counter = 0;		//zählt wieviele Animations-Schritte bereits ausgeführt wurden
var animation_parts = 5;	//bestimmt wieviele Animations-Schritte ausgeführt werden sollen
var current_x = -1;			//aktuelle x-Koordinate des Chars
var current_y = -1;			//aktuelle y-Koordinate des Chars
var char_width = 40;
var char_height = 40;
var direction = null;		//Richtung der Char-Bewegung
var interval = null;		//Interval-Objekt für Animationsphasen
var face_direction = "down";
var target_field_from_above;
var no_move = false;

//Feld im Raster auf dem sich der Char gerade befindet (von allen vier seiten)
var current_field_from_above = "3,3";
var current_field_from_below = "6,6";
var current_field_from_left = "3,6";
var current_field_from_right = "6,3";

var field_directions = {"up":current_field_from_above, "down":current_field_from_below, "left":current_field_from_left, "right":current_field_from_right};

function move_to_field(target_field, current_field, move_direction)
{
	var grid = grid_directions[move_direction];
	var current_x = grid[current_field][0];
	var current_y = grid[current_field][1];
	var target_x = grid[target_field][0];
	var target_y = grid[target_field][1];
	move_to_position(target_x, target_y, current_field);
}

function move_char()
{
	/*Hier wird der char bewegt bzw. die Animationsphasen werden gemalt
	FIXME: Kann man beim Aufruf von setInterval() irgendwie Parameter an die aufgerufene Funktion übergeben?*/
	//console.log("move_char");
	//var grid = grid_from_above;
	//var current_x = grid[current_field_from_above][0];
	//var current_y = grid[current_field_from_above][1];
	//var target_x = grid[target_field_from_above][0];
	//var target_y = grid[target_field_from_above][1];
	var standing = new Image();
	var char_file_name = "images/dummy_sprite_"+direction+"_bandana"
	standing.src = char_file_name+".png";
	canvas = document.getElementById("canvas");
	c = canvas.getContext("2d");
	var image = null;
	
	//FIXME: Das kann man bestimmt noch einfacher oder eleganter lösen...
	if ( animation_parts == 5 )
	{
		if ( move_counter >= 0 && move_counter <= 2 )
		{
			image = get_image(char_file_name+"1.png");
		}
		else if ( move_counter >= 3 && move_counter <= 5 )
		{
			image = get_image(char_file_name+"2.png");
		}
	}
	else
	{
		if ( move_counter >= 0 && move_counter <= 2 )
		{
			image = get_image(char_file_name+"1.png");
		}
		else if ( move_counter >= 3 && move_counter <= 5 )
		{
			image = get_image(char_file_name+".png");
		}
		else if ( move_counter >= 6 && move_counter <= 8 )
		{
			image = get_image(char_file_name+"2.png");
		}
	}
	
	var old_x = current_x;
	var old_y = current_y;
	if ( no_move == false )
	{
		if ( direction == "down" )
		{
			current_y = current_y + 8;
		}
		else if ( direction == "up" )
		{
			current_y = current_y - 8;
		}
		else if ( direction == "left" )
		{
			current_x = current_x - 5;
		}
		else if ( direction == "right" )
		{
			current_x = current_x + 5;
		}
	}
	c.clearRect(old_x, old_y, char_width, char_height);
	c.drawImage(image, current_x ,current_y, char_width, char_height);
	move_counter = move_counter + 1;
	//console.log("debug: "+move_counter);
	if ( move_counter >= animation_parts )
	{
		c.clearRect(old_x, old_y, char_width, char_height);
		c.drawImage(standing, current_x ,current_y, char_width, char_height);
		clearInterval(interval);
		move_counter = 0;
		running = false;
		move_lock = false;
		if ( no_move == false )
		{
			current_field_from_above = target_field_from_above;
		}
	}
}

function get_image(file)
{
	img = new Image();
	img.src = file;
	return img;
}

function get_target_field(current_field, grid, move_direction)
{
	console.log("DEBUG");
	var current_row = parseInt(current_field.split(",")[0]);
	var current_col = parseInt(current_field.split(",")[1]);
	var target_row = current_row;
	var target_col = current_col;
	if ( direction == "down" )
	{
		target_row = current_row+1;
	}
	else if ( direction == "up" )
	{
		target_row = current_row-1;
	}
	else if ( direction == "left" )
	{
		target_col = current_col-1;
	}
	else if ( direction == "right" )
	{
		target_col = current_col+1;
	}
	return target_row+","+target_col;
}

function start_moving(move_direction)
{
	no_move = false;
	if ( current_x == -1 )
	{
		current_x = grid_from_above[current_field_from_above][0];
	}
	if ( current_y == -1 )
	{
		current_y = grid_from_above[current_field_from_above][1];
	}
	if ( face_direction != move_direction )
	{
		var turned_char = get_image("images/dummy_sprite_"+move_direction+"_bandana.png");
		canvas = document.getElementById("canvas");
		c = canvas.getContext("2d");
		c.clearRect(current_x, current_y, char_width, char_height);
		c.drawImage(turned_char, current_x, current_y, char_width, char_height);
		face_direction = move_direction;
		return;
	}
	var grid = grid_from_above;
	target_field_from_above = get_target_field(current_field_from_above, grid, move_direction);
	//console.log(target_field_from_above);
	//console.log(free_roaming_area);
	if ($.inArray(target_field_from_above, free_roaming_area) == -1 && move_direction == "up")
	{
		no_move = true;
		move_background("up");
	}
	if ( running == false )
	{
		running = true;
		direction = move_direction;
		interval = setInterval(move_char, 60);
	}
}
