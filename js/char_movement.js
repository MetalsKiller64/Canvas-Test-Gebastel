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

function get_animation_image(char_file_name)
{
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
	return image;
}

function move_char()
{
	//debugger;
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
	var image = get_animation_image(char_file_name);
	c.clearRect(old_x, old_y, char_width, char_height);
	for ( var tries = 0; tries < 3; tries++ )
	{
		try
		{
			c.drawImage(image, current_x ,current_y, char_width, char_height);
			break;
		}
		catch (exception)
		{
			image = get_animation_image(char_file_name);
		}
	}
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
	//debugger;
	var current_row = parseInt(current_field.split(",")[0]);
	var current_col = parseInt(current_field.split(",")[1]);
	var target_row = current_row;
	var target_col = current_col;
	if ( move_direction == "down" )
	{
		target_row = current_row+1;
	}
	else if ( move_direction == "up" )
	{
		target_row = current_row-1;
	}
	else if ( move_direction == "left" )
	{
		target_col = current_col-1;
	}
	else if ( move_direction == "right" )
	{
		target_col = current_col+1;
	}
	return target_row+","+target_col;
}

function start_moving(move_direction)
{
	//debugger;
	if ( running == true )
	{
		console.log("blah!!");
		return;
	}
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
	//if ($.inArray(target_field_from_above, free_roaming_area) == -1 && move_direction == "up")
	var bg_move_line = undefined;
	var bg_move_col = undefined;
	if ( move_direction == "up" )
	{
		bg_move_line = bg_move_up_line;
	}
	else if ( move_direction == "down" )
	{
		bg_move_line = bg_move_down_line;
	}
	else if ( move_direction == "left" )
	{
		bg_move_col = bg_move_left_col;
	}
	else if ( move_direction == "right" )
	{
		bg_move_col = bg_move_right_col;
	}
	if ( move_direction == "up" || move_direction == "down" )
	{
		if ( target_field_from_above.split(",")[0] == bg_move_line )
		{
			no_move = true;
			move_background(move_direction);
		}
	}
	else if ( move_direction == "left" || move_direction == "right" )
	{
		if ( target_field_from_above.split(",")[1] == bg_move_col )
		{
			no_move = true;
			move_background(move_direction);
		}
	}
	if ( running == false )
	{
		running = true;
		direction = move_direction;
		interval = setInterval(move_char, 60);
	}
	else
	{
		return;
	}
	if ( no_move == false )
	{
		current_field_from_above = target_field_from_above;
	}
}
