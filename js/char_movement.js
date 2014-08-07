var running = false;		//bestimmt ob gerade eine Animation ausgeführt wird
var move_counter = 0;		//zählt wieviele Animations-Schritte bereits ausgeführt wurden
var animation_parts = 5;	//bestimmt wieviele Animations-Schritte ausgeführt werden sollen
var current_x = -1;			//aktuelle x-Koordinate des Chars
var current_y = -1;			//aktuelle y-Koordinate des Chars
var char_width = 40;
var char_height = 40;
var direction = null;		//Richtung der Char-Bewegung
var player_move_interval = null;		//Interval-Objekt für Animationsphasen
var face_direction = "down";
var target_field_from_above;
var no_move = false;
var player_object = {};
var player_canvas_objects = {};
var player_animation_parts = {};
var player_animation_counter = 0;
var max_player_animation_parts = 2;

//Feld im Raster auf dem sich der Char gerade befindet (von allen vier seiten)
var current_field_from_above = "3,3";
var current_field_from_below = "6,6";
var current_field_from_left = "3,6";
var current_field_from_right = "6,3";

var field_directions = {"up":current_field_from_above, "down":current_field_from_below, "left":current_field_from_left, "right":current_field_from_right};

function init_player()
{
	var player_div = document.createElement("div");
	player_object["container"] = player_div;
	player_object["face_direction"] = "down";
	player_object["position_key"] = "3,3";
	var player_x = grid_from_above[player_object["position_key"]][0];
	var player_y = grid_from_above[player_object["position_key"]][1];
	player_div.width = 40;
	player_div.height = 40;
	player_div.style.top = player_y+y_offset;
	player_div.style.left = player_x+x_offset;
	player_div.style.position = "absolute";
	for ( var i = 0; i < 12; i++ )
	{
		var canvas = document.createElement("canvas");
		canvas.id = "player_"+drawings[i];
		canvas.width = 40;
		canvas.height = 40;
		var player_img = new Image();
		player_img.canvas = canvas;				//das canvas-object muss innerhalb des onload-hanlders verfügbar sein, sonst werden alle bilder in das zu letzt erzeugte canvas gemalt-object
		player_img.onload = function() {
			var cc = this.canvas.getContext("2d");
			cc.drawImage(this,0,0,40,40);
		};
		player_img.src = "images/dummy_sprite_"+drawings[i]+"_bandana.png";
		if ( drawings[i] != "down0" )
		{
			canvas.style.display = "none";
		}
		player_div.appendChild(canvas);
		player_canvas_objects[drawings[i]] = canvas;
	}
	document.body.appendChild(player_div);
}

function move_player(move_direction)
{
	//debugger;
	if ( player_object["movement_in_progress"] == true )
	{
		console.log("der player bewegt sich gerade!");
		return;
	}
	player_object["movement_in_progress"] = true;
	var target_field = get_target_field(player_object["position_key"], move_direction);
	var player_div = player_object["container"];
	var player_face_direction = player_object["face_direction"];
	if ( player_face_direction != move_direction )
	{
		var standing_player = player_canvas_objects[move_direction+"0"];
		player_object["face_direction"] = move_direction;
		switch_player_canvas(standing_player);
		player_object["movement_in_progress"] = false;
		return;
	}
	
	var bg_move_line = bg_move_lines[move_direction];
	var bg_move_col = bg_move_cols[move_direction];
	if ( bg_move_line != undefined )
	{
		if ( target_field.split(",")[0] == bg_move_line )
		{
			no_move = true;
			move_background(move_direction);
		}
	}
	else if ( bg_move_col != undefined )
	{
		if ( target_field.split(",")[1] == bg_move_col )
		{
			no_move = true;
			move_background(move_direction);
		}
	}
	
	var target_x = grid_from_above[target_field][0];
	var target_y = grid_from_above[target_field][1];
	//debugger;
	player_animation_counter = 0;
	player_animation_parts[0] = player_canvas_objects[move_direction+"1"];
	interval_milisec = 165;
	max_player_animation_parts = 2;
	if ( move_direction == "left" || move_direction == "right" )
	{
		player_animation_parts[1] = player_canvas_objects[move_direction+"0"];
		player_animation_parts[2] = player_canvas_objects[move_direction+"2"];
		player_animation_parts[3] = player_canvas_objects[move_direction+"0"];
		max_player_animation_parts = 3;
		interval_milisec = 110;
	}
	else
	{
		player_animation_parts[1] = player_canvas_objects[move_direction+"2"];
		player_animation_parts[2] = player_canvas_objects[move_direction+"0"];
	}
	player_object["animation_interval"] = setInterval( function() {animate_player()}, interval_milisec );
	if ( no_move == true )
	{
		player_object["movement_in_progress"] = false;
		no_move = false;
		return;
	}
	player_object["move_interval"] = setInterval( function() {move_player_div(move_direction, target_field, 1, target_x, target_y)}, 10 )
}

function animate_player()
{
	//debugger;
	var current_animation_part = player_animation_parts[player_animation_counter];
	switch_player_canvas(current_animation_part);
	if ( player_animation_counter >= max_player_animation_parts )
	{
		clearInterval(player_object["animation_interval"]);
		player_animation_counter = 0;
		return;
	}
	player_animation_counter += 1;
}

function switch_player_canvas(target_object)
{
	for ( var key in player_canvas_objects )
	{
		var current_obj = player_canvas_objects[key];
		if ( current_obj == target_object )
		{
			current_obj.style.display = "";
		}
		else
		{
			current_obj.style.display = "none";
		}
	}
}

function move_player_div(move_direction, target_field, pixels, target_x, target_y)
{
	var player_div = player_object["container"];
	target_x += 10;
	target_y += 10;
	var current_x = parseInt(player_div.style.left.replace("/px$/", ""));
	var current_y = parseInt(player_div.style.top.replace("/px$/", ""));
	//debugger;
	if ( move_direction == "left" )
	{
		current_x -= pixels;
	}
	else if ( move_direction == "right" )
	{
		current_x += pixels;
	}
	else if ( move_direction == "up" )
	{
		current_y -= pixels;
	}
	else if ( move_direction == "down" )
	{
		current_y += pixels;
	}
	player_div.style.left = current_x;
	player_div.style.top = current_y;
	if ( current_x == target_x && current_y == target_y )
	{
		clearInterval(player_object["move_interval"]);
		player_object["position_key"] = target_field;
		player_object["movement_in_progress"] = false;
		return;
	}
}

function get_animation_image(char_file_obj, move_direction, animation_phases, current_move_counter)
{
	var image = null;
	var char_file_name = "";

	//FIXME: Das kann man bestimmt noch einfacher oder eleganter lösen...
	var char_file_number = 1;
	if ( animation_phases == 5 )
	{
		if ( current_move_counter >= 0 && current_move_counter <= 2 )
		{
			//image = get_image(char_file_name+"1.png");
			char_file_number = 1;
		}
		else if ( current_move_counter >= 3 && current_move_counter <= 5 )
		{
			//image = get_image(char_file_name+"2.png");
			char_file_number = 2;
		}
	}
	else
	{
		if ( current_move_counter >= 0 && current_move_counter <= 2 )
		{
			//image = get_image(char_file_name+"1.png");
			char_file_number = 1;
		}
		else if ( current_move_counter >= 3 && current_move_counter <= 5 )
		{
			//image = get_image(char_file_name+".png");
			char_file_number = 0;
		}
		else if ( current_move_counter >= 6 && current_move_counter <= 8 )
		{
			//image = get_image(char_file_name+"2.png");
			char_file_number = 2;
		}
	}
	if ( char_file_obj.indexOf("|") != -1 )
	{
		var char_file_name_parts = char_file_obj.split("|");
		char_file_name = char_file_name_parts[0]+move_direction+char_file_number+char_file_name_parts[1];
	}
	image = get_image(char_file_name)
	return image;
}

function move_char(char_file_name, move_direction)
{
	//debugger;
	//Hier wird der char bewegt bzw. die Animationsphasen werden gemalt
	var standing_char = new Image();
	var standing_char_file = char_file_name;
	if ( char_file_name.indexOf("|") != -1 )
	{
		var char_file_parts = char_file_name.split("|");
		standing_char_file = char_file_parts[0]+move_direction+"0"+char_file_parts[1]+".png";
	}
	standing_char.src = standing_char_file;
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
	var image = get_animation_image(char_file_name, move_direction, animation_parts, move_counter);
	c.clearRect(old_x, old_y, char_width, char_height);
	//FIXME: hier image.onload() verwenden anstatt der schleife
	for ( var tries = 0; tries < 3; tries++ )
	{
		try
		{
			c.drawImage(image, current_x ,current_y, char_width, char_height);
			break;
		}
		catch (exception)
		{
			image = get_animation_image(char_file_name, move_direction, animation_parts, move_counter);
		}
	}
	move_counter = move_counter + 1;
	//console.log("debug: "+move_counter);
	if ( move_counter >= animation_parts )
	{
		c.clearRect(old_x, old_y, char_width, char_height);
		c.drawImage(standing_char, current_x ,current_y, char_width, char_height);
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

function get_target_field(current_field, move_direction)
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
		var turned_char = get_image("images/dummy_sprite_"+move_direction+"0_bandana.png");
		canvas = document.getElementById("canvas");
		c = canvas.getContext("2d");
		c.clearRect(current_x, current_y, char_width, char_height);
		c.drawImage(turned_char, current_x, current_y, char_width, char_height);
		face_direction = move_direction;
		return;
	}
	var grid = grid_from_above;
	target_field_from_above = get_target_field(current_field_from_above, move_direction);
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
		interval = setInterval( function() { move_char("images/dummy_sprite_|_bandana", move_direction); }, 60);
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
