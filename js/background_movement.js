var background_tiles_from_above = {};
var background_tiles_from_below = {};
var background_tiles_from_left = {};
var background_tiles_from_right = {};
var background_tiles_directions = {"up": background_tiles_from_above, "down":background_tiles_from_below, "left":background_tiles_from_left, "right":background_tiles_from_right};
var max_background_x = 0;
var max_background_y = 0;
//var grid = {};
var grid_from_above = {};
var grid_from_below = {};
var grid_from_left = {};
var grid_from_right = {};
var grid_directions = {"up": grid_from_above, "down":grid_from_below, "left":grid_from_left, "right":grid_from_right};
var grids_ready = false;
var free_roaming_area = ["3,3","3,4","3,5","3,6", "4,3","4,4","4,5","4,6", "5,3","5,4","5,5","5,6", "6,3","6,4","6,5","6,6"];
var bg_move_up_line = "1";
var bg_move_down_line = "8";
var bg_move_left_col = "1";
var bg_move_right_col = "8";
var last_move_direction = "up";
var key_map_up_to_down = {};
var key_map_up_to_left = {};
var key_map_up_to_right = {};
var key_map_down_to_up = {};
var key_map_down_to_left = {};
var key_map_down_to_right = {};
var key_map_left_to_right = {};
var key_map_left_to_up = {};
var key_map_left_to_down = {};
var key_map_right_to_left = {};
var key_map_right_to_up = {};
var key_map_right_to_down = {};
var key_map_directions = {"up_down":key_map_up_to_down, "up_left":key_map_up_to_left, "up_right":key_map_up_to_right, "down_up":key_map_down_to_up, "down_left":key_map_down_to_left, "down_right":key_map_down_to_right, "left_right":key_map_left_to_right, "left_up":key_map_left_to_up, "left_down":key_map_left_to_down, "right_left":key_map_right_to_left, "right_up":key_map_right_to_up, "right_down":key_map_right_to_down};
var mapping_directions = {"down":"up_down", "up":"down_up", "left":"right_left", "right":"left_right"};

function init_grid()
{
	if ( grids_ready )
	{
		console.log("die Raster-Objekte sind bereits initialisiert")
		return;
	}
	var y = 0;
	var step = 40;
	var key = "";
	var row = 0;
	var x = 0;
	var col = 0;
	var max_row = 9;
	var max_col = 9;
	for ( row = 0; row < 10; row++ )
	{
		x = 0;
		for ( col = 0; col < 10; col++ )
		{
			key = row+","+col;
			var down_mapped_key = (max_row-row)+","+(max_col-col);
			var left_mapped_key = col+","+(max_row-row);
			var right_mapped_key = (max_col-col)+","+row;
			//console.log("key:"+key+"; mapped_left:"+left_mapped_key);
			//console.log("key:"+key+"; mapped_right:"+right_mapped_key);
			key_map_up_to_down[key] = down_mapped_key;
			key_map_up_to_left[key] = left_mapped_key;
			key_map_up_to_right[key] = right_mapped_key;
			grid_from_above[key] = [x,y];
			x += step;
		}
		y += step;
	}
	
	y = 360;
	key = "";
	for ( row = 0; row < 10; row++ )
	{
		x = 360;
		for ( col = 0; col < 10; col++ )
		{
			key = row+","+col;
			var up_mapped_key = (max_row-row)+","+(max_col-col);
			var left_mapped_key = (max_col-col)+","+row;
			var right_mapped_key = col+","+(max_row-row);
			//console.log("key:"+key+"; mapped_left:"+left_mapped_key);
			//console.log("key:"+key+"; mapped_right:"+right_mapped_key);
			key_map_down_to_up[key] = up_mapped_key;
			key_map_down_to_left[key] = left_mapped_key;
			key_map_down_to_right[key] = right_mapped_key;
			grid_from_below[key] = [x,y];
			x -= step;
		}
		y -= step;
	}
	
	x = 0;
	key = "";
	for ( row = 0; row < 10; row++ )
	{
		y = 360;
		for ( col = 0; col < 10; col++ )
		{
			key = row+","+col;
			var up_mapped_key = (max_col-col)+","+row;
			var down_mapped_key = col+","+(max_row-row);
			//console.log("key:"+key+"; mapped_up:"+up_mapped_key);
			//console.log("key:"+key+"; mapped_down:"+down_mapped_key);
			var right_mapped_key = (max_row-row)+","+(max_col-col);
			key_map_left_to_right[key] = right_mapped_key;
			key_map_left_to_up[key] = up_mapped_key;
			key_map_left_to_down[key] = down_mapped_key;
			grid_from_left[key] = [x,y];
			y -= step;
		}
		x += step;
	}
	
	x = 360;
	key = "";
	for ( row = 0; row < 10; row++ )
	{
		y = 0;
		for ( col = 0; col < 10; col++ )
		{
			key = row+","+col;
			var left_mapped_key = (max_row-row)+","+(max_col-col);
			var up_mapped_key = col+","+(max_col-row);
			var down_mapped_key = (max_col-col)+","+row;
			//console.log("key:"+key+"; mapped_up:"+up_mapped_key);
			//console.log("key:"+key+"; mapped_down:"+down_mapped_key);
			key_map_right_to_left[key] = left_mapped_key;
			key_map_right_to_up[key] = up_mapped_key;
			key_map_right_to_down[key] = down_mapped_key;
			grid_from_right[key] = [x,y];
			y += step;
		}
		x -= step;
	}
	grids_ready = true;
}

function check_key_maps()
{
	for ( var key in key_map_up_to_down )
	{
		console.log("key:"+key+", mapped:"+key_map_up_to_down[key]);
	}
}

function get_mapped_key(key, mapping_direction)
{
	var key_map = key_map_directions[mapping_direction];
	mapped_key = key_map[key];
	return mapped_key;
}

function check_grids()
{
	var grid = grid_from_above;
	console.log(">>>above<<<");
	for ( var key in grid )
	{
		console.log(key);
		console.log(grid[key]);
	}
	
	var grid = grid_from_below;
	console.log(">>>below<<<");
	for ( var key in grid )
	{
		console.log(key);
		console.log(grid[key]);
	}
	
	var grid = grid_from_left;
	console.log(">>>left<<<");
	for ( var key in grid )
	{
		console.log(key);
		console.log(grid[key]);
	}
	
	var grid = grid_from_right;
	console.log(">>>right<<<");
	for ( var key in grid )
	{
		console.log(key);
		console.log(grid[key]);
	}
}

function store_background_tile(grid_direction, key, is_solid, img, override)
{
	var background_tiles = background_tiles_directions[grid_direction];
	//var background_tiles = background_tiles_directions["up"];
	//Die Tiles werden in einem globalen Dictionary gespeichert, sodass für jedes Tile Koordinaten und andere Eigenschaften zugänglich sind
	if ( background_tiles[key] == undefined )
	{
		//console.log("debug: store_background_tile: "+x_id+" undefined")
		background_tiles[key] = [is_solid, img];
	}
	else if ( override != undefined && override == true )
	{
		background_tiles[key] = [is_solid, img];
	}
	else
	{
		console.log("das tile mit dem Key \""+key+"\" existiert bereits!");
	}
}

function get_background_tile(number)
{
	var img_obj = new Image();
	img_obj.src = "images/grass_tile"+number+".png";
	return img_obj;
}

function fill_grid_randomly()
{
	var bg = document.getElementById("background_canvas");
	var c = bg.getContext("2d");
	var grid = grid_from_above;
	var key = "";
	for ( key in grid )
	{
		var current_field = grid[key];
		var field_x = current_field[0];
		var field_y = current_field[1];
		var random_value = Math.floor((Math.random() * 4) + 1);
		var random_tile = get_background_tile(random_value);
		var x_id = key.split(",")[0];
		var y_id = key.split(",")[1];
		if ( $.inArray(key, free_roaming_area) != -1 )
		{
			random_tile = new Image();
			random_tile.src = "images/grass_tile_marked.png";
		}
		store_background_tile("up", key, false, random_tile, true);
		var mapped_key = get_mapped_key(key, "up_down");
		store_background_tile("down", mapped_key, false, random_tile, true);
		var mapped_key = get_mapped_key(key, "up_left");
		store_background_tile("left", mapped_key, false, random_tile, true);
		var mapped_key = get_mapped_key(key, "up_right");
		store_background_tile("right", mapped_key, false, random_tile, true);
		c.drawImage(random_tile, field_x, field_y, 40, 40);
	}
	
	/*grid = grid_from_below;
	for ( key in grid )
	{
		var current_field = grid[key];
		var fieldx = current_field[0];
		var fieldy = current_field[1];
		
	}*/
}

function move_background(direction)
{
	//debugger;
	var bg = document.getElementById("background_canvas");
	var c = bg.getContext("2d");
	var grid = grid_directions[direction];
	var end_row = 9;
	var end_col = 0;
	var end_key = end_row+","+end_col;
	var row_tiles = {};
	//var mapping_direction = mapping_directions[direction];
	var mapping_direction = last_move_direction+"_"+direction;
	//debugger;
	var prev_field = undefined;
	var prev_row = 0;
	var saved_tiles = {};
	var background_tiles = background_tiles_directions[direction];
	//var background_tiles = background_tiles_directions["up"];
	var mapped_key = undefined;
	for ( var key in grid )
	{
		var key_row = parseInt(key.split(",")[0]);
		var key_col = parseInt(key.split(",")[1]);
		if ( saved_tiles[key_row+1] == undefined )
		{
			saved_tiles[key_row+1] = {};
		}
		saved_tiles[key_row+1][key_col] = {};
		var new_tile = undefined;
		if (key_row <= end_row)
		{
			
			var current_tile = background_tiles[key][1];
			saved_tiles[key_row+1][key_col] = current_tile;
			if ( saved_tiles[key_row] == undefined )
			{
				var random_value = Math.floor((Math.random() * 4) + 1);
				var random_tile = get_background_tile(random_value);
				new_tile = random_tile;
			}
			else
			{
				new_tile = saved_tiles[key_row][key_col];
			}
			
			store_background_tile(direction, key, false, new_tile, true);
			if ( direction == "up" )
			{
				mapped_key = get_mapped_key(key, "up_down");
				store_background_tile("down", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "up_left");
				store_background_tile("left", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "up_right");
				store_background_tile("right", mapped_key, false, new_tile, true);
			}
			else if ( direction == "down" )
			{
				mapped_key = get_mapped_key(key, "down_up");
				store_background_tile("up", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "down_left");
				store_background_tile("left", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "down_right");
				store_background_tile("right", mapped_key, false, new_tile, true);
			}
			else if ( direction == "left" )
			{
				mapped_key = get_mapped_key(key, "left_right");
				store_background_tile("right", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "left_up");
				store_background_tile("up", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "left_down");
				store_background_tile("down", mapped_key, false, new_tile, true);
			}
			else if ( direction == "right" )
			{
				mapped_key = get_mapped_key(key, "right_left");
				store_background_tile("left", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "right_up");
				store_background_tile("up", mapped_key, false, new_tile, true);
				mapped_key = get_mapped_key(key, "right_down");
				store_background_tile("down", mapped_key, false, new_tile, true);
			}
			
		}
	}
	//debugger;
	for ( key in grid )
	{
		//var mapped_key = get_mapped_key(key, mapping_direction);
		var tile = background_tiles[key];
		var tile_img = tile[1];
		var field = grid[key];
		var fieldx = field[0];
		var fieldy = field[1];
		c.drawImage(tile_img, fieldx, fieldy, 40, 40);
	}
	last_move_direction = direction;
}

function show()
{
	init_grid();
	fill_grid_randomly();
	var canvas = document.getElementById("canvas");
	var c = canvas.getContext("2d");
	var current_char_x = grid_from_above[current_field_from_above][0];
	var current_char_y = grid_from_above[current_field_from_above][1];
	var char_img = get_image("images/dummy_sprite_down_bandana.png");
	c.drawImage(char_img, current_char_x, current_char_y, char_width, char_height);
}

function check_char_position()
{
	//manchmal verrutscht der Char in der Position zwischen die Tiles was dann doof aussieht;
	//um das zu verhindern wird vor dem Bewegen die position mit der des aktuellen Tiles abgeglichen
	if ( running == true )
	{
		console.log("char is moving...");
		return;
	}
	var grid = grid_from_above;
	var current_field_assumed = current_field_from_above;
	var last_move_direction = direction;
	var current_x_assumed = grid[current_field_assumed][0];
	var current_y_assumed = grid[current_field_assumed][1];
	if ( current_x != current_x_assumed || current_y != current_y_assumed )
	{
		var char_img = get_image("images/dummy_sprite_"+last_move_direction+"_bandana.png");
		var canvas = document.getElementById("canvas");
		var c = canvas.getContext("2d");
		c.clearRect(current_x, current_y, char_width, char_height);
		c.drawImage(char_img, current_x_assumed, current_y_assumed, char_width, char_height);
		current_x = current_x_assumed;
		current_y = current_y_assumed;
	}
}