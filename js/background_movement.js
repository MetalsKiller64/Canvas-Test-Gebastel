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
//var bg_move_up_line = "1";
//var bg_move_down_line = "8";
//var bg_move_left_col = "1";
//var bg_move_right_col = "8";
var bg_move_lines = {"up":"1", "down":"8", "left":undefined, "right": undefined};
var bg_move_cols = {"left":"1", "right":"8", "up":undefined, "down": undefined};
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

//var world = {0:"one part of the world", 1:"another part of the world", 2:"some other part"};
//var parts = {"one part of the world":"reference to the chunks of this part", "another part of the world":"the chunks of this part"};
//var chunks = {"reference to the chunks of this part":{0:"images/grass_chunk_test.png"}, "the chunks of this part":{}};

//var tiles = {0:{"0,0":"irgendein image-part", "0,1":"noch ein image-part"}, 1:{"0,0":"img-part von einem anderen chunk", "0,1":"ein weiterer img-part"}, 2:{"0,0":"blah", "0,1":"blubber"}, 3:{"0,0":"fasel", "0,1":"foo"}, 4:{"0,0":"bar", "0,1":"batz"}, 5:{"0,0":"dinge", "0,1":"donge"}};
//var chunks = {0:{0:tiles[0], 1:tiles[1], 2:tiles[2]}, 1:{0:tiles[3], 1:tiles[4], 2:tiles[5]}};
//var chunks = {0:{"0,0":"irgendein image-part", "0,1":"noch ein image-part"}, 1:{"0,0":"img-part von einem anderen chunk", "0,1":"ein weiterer img-part"}, 2:{"0,0":"blah", "0,1":"blubber"}, 3:{"0,0":"fasel", "0,1":"foo"}, 4:{"0,0":"bar", "0,1":"batz"}, 5:{"0,0":"dinge", "0,1":"donge"}};
//var parts = {0:{0:chunks[0], 1:chunks[1], 2:chunks[2]}, 1:{0:chunks[3], 1:chunks[4], 2:chunks[5]}};
//var world = {0:parts[0], 1:parts[1]};

function blubber()
{
	for ( var part in world )
	{
		console.log("part: "+part);
		for ( var chunk in world[part] )
		{
			console.log("> chunk: "+chunk);
			for ( var tilemap in world[part][chunk] )
			{
				console.log("> > > tile: "+world[part][chunk][tilemap]);
			}
		}
	}
}

//var chunk_sources = ["images/grass_chunk_test0.png", "images/grass_chunk_test1.png"];
var chunk_source = "images/world/"
var chunks = {};
var parts = {};

function does_file_exist(filepath)
{
	/*
	ergebnis = false;
	//debugger;
	$.ajax({
		url:filepath,
		type:'HEAD',
		error: function() {
			ergebnis = false;
			return;
		},
		success: function() {
			ergebnis = true;
			return;
		}
	});
	*/
	//debugger;
	console.log(filepath)
	var xhr = new XMLHttpRequest();
	xhr.open('HEAD', filepath, false);
	try
	{
		xhr.send();
	}
	catch (e)
	{
		return false;
	}
	
	if (xhr.status == "404")
	{
		return false;
	}
	else
	{
		return true;
	}
	
	//return ergebnis;
}

function test_image_split()
{
	//debugger;
	var part_key = 0+","+0;
	/*
	for ( var pcol = 0; pcol < 10; pcol++ )
	{
		for ( var prow = 0; prow < 10; prow++ )
		{
			part_key = prow+","+pcol;
		}
	}
	*/
	for ( var ccol = 0; ccol < 10; ccol++ )
	{
		for ( var crow = 0; crow < 10; crow++ )
		{
			var chunk_key = crow+","+ccol;
			var source = chunk_source+part_key+"/"+chunk_key+".png";
			var result = does_file_exist(source);
			if ( result == false )
			{
				console.log("file "+source+" existiert nicht")
				continue;
			}
			var src_step = 16;
			var dst_step = 40;
			var src_x = 0;
			var dst_x = 0;
			for ( var col = 0; col < 10; col++ )
			{
				var src_y = 0;
				var dst_y = 0;
				for ( var row = 0; row < 10; row++ )
				{
					var img = new Image();
					var tile_key = row+","+col;
					img.tile_key = tile_key;
					img.src_x = src_x;
					img.src_y = src_y;
					img.dst_x = dst_x;
					img.dst_y = dst_y;
					img.onload = function() {
						var canvas = document.getElementById("background_canvas");
						var c = canvas.getContext("2d");
						c.drawImage(this, this.src_x, this.src_y, src_step, src_step, this.dst_x, this.dst_y, dst_step, dst_step);
					}
					img.src = source;
					if ( chunks[chunk_key] == undefined )
					{
						chunks[chunk_key] = {};
					}
					chunks[chunk_key][tile_key] = img;
					src_y += src_step;
					dst_y += dst_step;
				}
				src_x += src_step;
				dst_x += dst_step;
			}
			if ( parts[part_key] == undefined )
			{
				parts[part_key] = [];
			}
			parts[part_key][chunk_key] = undefined;
		}
	}
	
	/*
	for ( var chunk_src in chunk_sources )
	{
		var source = chunk_sources[chunk_src];
		var src_step = 16;
		var dst_step = 40;
		var src_x = 0;
		var dst_x = 0;
		for ( var col = 0; col < 10; col++ )
		{
			var src_y = 0;
			var dst_y = 0;
			for ( var row = 0; row < 10; row++ )
			{
				var img = new Image();
				var tile_key = row+","+col;
				img.tile_key = tile_key;
				img.src_x = src_x;
				img.src_y = src_y;
				img.dst_x = dst_x;
				img.dst_y = dst_y;
				img.onload = function() {
					var canvas = document.getElementById("background_canvas");
					var c = canvas.getContext("2d");
					c.drawImage(this, this.src_x, this.src_y, src_step, src_step, this.dst_x, this.dst_y, dst_step, dst_step);
				}
				img.src = source;
				if ( chunks[chunk_key] == undefined )
				{
					chunks[chunk_key] = {};
				}
				chunks[chunk_key][tile_key] = img;
				if ( parts[part_key] == undefined )
				{
					parts[part_key] = [];
				}
				src_y += src_step;
				dst_y += dst_step;
			}
			src_x += src_step;
			dst_x += dst_step;
		}
		parts[part_key].push(chunk_key);
		chunk_key += 1;
	}
	*/
}

function testblah()
{
	for ( var part_key in parts )
	{
		var part = parts[part_key];
		console.log("part_key: "+part_key);
		console.log("part: "+part);
		for ( var chunk_key in part )
		{
			console.log(">> chunk: "+chunk_key);
			for ( tile_key in chunks[chunk_key] )
			{
				console.log(">>>> tile_key: "+tile_key);
				console.log(">>>>>>>>> pos: "+chunks[chunk_key][tile_key].src_x+","+chunks[chunk_key][tile_key].src_y);
				console.log(">>>>>>>>> tile: "+chunks[chunk_key][tile_key]);
			}
		}
	}
}

function init_grid()
{
	if ( grids_ready )
	{
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

function get_background_tile(number, fieldx, fieldy)
{
	var img_obj = new Image();
	img_obj.fx = fieldx;
	img_obj.fy = fieldy;
	img_obj.onload = function() {
		var canvas = document.getElementById("background_canvas");
		var c = canvas.getContext("2d");
		c.drawImage(this, this.fx, this.fy, 40, 40);
	}
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
		var random_tile = get_background_tile(random_value, field_x, field_y);
		var x_id = key.split(",")[0];
		var y_id = key.split(",")[1];
		if ( $.inArray(key, free_roaming_area) != -1 )
		{
			random_tile = new Image();
			random_tile.fx = field_x;
			random_tile.fy = field_y;
			random_tile.onload = function() {
				var canvas = document.getElementById("background_canvas");
				var c = canvas.getContext("2d");
				c.drawImage(this, this.fx, this.fy, 40, 40);
			}
			random_tile.src = "images/grass_tile_marked.png";
		}
		store_background_tile("up", key, false, random_tile, true);
		var mapped_key = get_mapped_key(key, "up_down");
		store_background_tile("down", mapped_key, false, random_tile, true);
		var mapped_key = get_mapped_key(key, "up_left");
		store_background_tile("left", mapped_key, false, random_tile, true);
		var mapped_key = get_mapped_key(key, "up_right");
		store_background_tile("right", mapped_key, false, random_tile, true);
		//c.drawImage(random_tile, field_x, field_y, 40, 40);
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
	var active_mob_positions = {};
	//debugger;
	for ( var mob_id in active_mobs )
	{
		if ( active_mobs[mob_id] == undefined )
		{
			continue;
		}
		var mob_pos = active_mobs[mob_id]["position_key"];
		active_mob_positions[mob_id] = active_mobs[mob_id]["position_key"];
	}
	
	//var background_tiles = background_tiles_directions["up"];
	var mapped_key = undefined;
	for ( var key in grid )
	{
		var key_row = parseInt(key.split(",")[0]);
		var key_col = parseInt(key.split(",")[1]);
		var field_x = grid[key][0];
		var field_y = grid[key][1];
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
				var random_tile = get_background_tile(random_value, field_x, field_y);
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

		for ( var mob_id in active_mob_positions )
		{
			if ( active_mobs[mob_id] == undefined )
			{
				continue;
			}
			var mob_pos = active_mob_positions[mob_id];
			var mob_row = parseInt(mob_pos.split(",")[0]);
			var mob_col = parseInt(mob_pos.split(",")[1]);
			if ( direction == "up" )
			{
				mob_row += 1;
			}
			else if ( direction == "down" )
			{
				mob_row -= 1;
			}
			else if ( direction == "left" )
			{
				mob_col += 1;
			}
			else if ( direction == "right" )
			{
				mob_col -= 1;
			}
			new_mob_pos = mob_row+","+mob_col;
			if ( grid_from_above[new_mob_pos] == undefined )
			{
				despawn_mob(parseInt(mob_id));
				active_mob_positions[mob_id] = undefined;
				continue;
			}
			active_mobs[mob_id]["position_key"] = new_mob_pos;
			var new_mob_x = grid_from_above[new_mob_pos][0]+x_offset;
			var new_mob_y = grid_from_above[new_mob_pos][1]+y_offset;
			var mob = active_mobs[mob_id]["div"];
			mob.style.left = new_mob_x;
			mob.style.top = new_mob_y;
		}
	}
	last_move_direction = direction;
}

/*
function test_image_split()
{
	var source = "images/grass_chunk_test.png";
	var src_step = 16;
	var dst_step = 40;
	var src_x = 0;
	var dst_x = 0;
	for ( var x = 0; x < 10; x++ )
	{
		var src_y = 0;
		var dst_y = 0;
		for ( var y = 0; y < 10; y++ )
		{
			var img = new Image();
			img.src_x = src_x;
			img.src_y = src_y;
			img.dst_x = dst_x;
			img.dst_y = dst_y;
			img.onload = function() {
				var canvas = document.getElementById("background_canvas");
				c = canvas.getContext("2d");
				console.log(this.src_x+", "+this.src_y+", "+src_step+", "+src_step+", "+this.dst_x+", "+this.dst_x+", "+dst_step+", "+dst_step)
				c.drawImage(this, this.src_x, this.src_y, src_step, src_step, this.dst_x, this.dst_y, dst_step, dst_step);
			}
			img.src = source
			src_y += src_step;
			dst_y += dst_step;
		}
		src_x += src_step;
		dst_x += dst_step;
	}
}
*/
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
		var char_img = get_image("images/dummy_sprite_"+last_move_direction+"0_bandana.png");
		var canvas = document.getElementById("canvas");
		var c = canvas.getContext("2d");
		c.clearRect(current_x, current_y, char_width, char_height);
		c.drawImage(char_img, current_x_assumed, current_y_assumed, char_width, char_height);
		current_x = current_x_assumed;
		current_y = current_y_assumed;
	}
}