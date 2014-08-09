var last_id = 0;
var mob_move_directions = ["up", "down", "left", "right"];
var active_mobs = {};
var mob_canvas_objects = {};
var drawings = ["up0","up1","up2","down0","down1","down2","left0","left1","left2","right0","right1","right2"];
var x_offset = 10;
var y_offset = 10;

function move_mob(id, current_field, target_field, move_direction)
{
	//debugger;
	var mob = active_mobs[id]["div"];
	var standing_mob = mob_canvas_objects[id][move_direction+"0"];
	var mob_face_direction = active_mobs[id]["face_direction"];
	if ( mob_face_direction != move_direction )
	{
		active_mobs[id]["face_direction"] = move_direction;
		switch_mob_canvas(id, standing_mob);
		return;
	}
	if ( grid_from_above[target_field] == undefined )
	{
		console.log("mob("+id+"): da geht's nich lang!");
		return;
	}
	var target_x = grid_from_above[target_field][0];
	var target_y = grid_from_above[target_field][1];
	
	active_mobs[id]["animation_counter"] = 0;
	active_mobs[id]["animation_parts"] = [];
	active_mobs[id]["animation_parts"][0] = mob_canvas_objects[id][move_direction+"1"];
	interval_milisec = 165;
	active_mobs[id]["max_animation_parts"] = 2;
	if ( move_direction == "left" || move_direction == "right" )
	{
		active_mobs[id]["animation_parts"][1] = mob_canvas_objects[id][move_direction+"0"];
		active_mobs[id]["animation_parts"][2] = mob_canvas_objects[id][move_direction+"2"];
		active_mobs[id]["animation_parts"][3] = mob_canvas_objects[id][move_direction+"0"];
		active_mobs[id]["max_animation_parts"] = 3;
		interval_milisec = 110;
	}
	else
	{
		active_mobs[id]["animation_parts"][1] = mob_canvas_objects[id][move_direction+"2"];
		active_mobs[id]["animation_parts"][2] = mob_canvas_objects[id][move_direction+"0"];
	}
	active_mobs[id]["animation_interval"] = setInterval( function() { animate_mob(id); }, interval_milisec);
	active_mobs[id]["move_interval"] = setInterval( function() {move_mob_div(id, move_direction, target_field, 1, target_x, target_y)}, 10 )
}

function animate_mob(id)
{
	//debugger;
	var current_animation_counter = active_mobs[id]["animation_counter"];
	var current_animation_part = active_mobs[id]["animation_parts"][current_animation_counter];
	switch_mob_canvas(id, current_animation_part);
	if ( current_animation_counter >= active_mobs[id]["max_animation_parts"] )
	{
		clearInterval(active_mobs[id]["animation_interval"]);
		active_mobs[id]["animation_interval"] = undefined;
		active_mobs[id]["animation_counter"] = 0;
		return;
	}
	active_mobs[id]["animation_counter"] += 1;
}

function move_mob_div(id, move_direction, target_field, pixels, target_x, target_y)
{
	//debugger;
	var mob_div = active_mobs[id]["div"];
	target_x += 10;
	target_y += 10;
	var current_x = parseInt(mob_div.style.left.replace("/px$/", ""));
	var current_y = parseInt(mob_div.style.top.replace("/px$/", ""));
	//current_x = current_x-x_offset;
	//current_y = current_y-y_offset; 
	//console.log(current_x);
	var movement_counter = active_mobs[id][1];
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
	mob_div.style.left = current_x;
	mob_div.style.top = current_y;
	if ( current_x == target_x && current_y == target_y )
	{
		
		clearInterval(active_mobs[id]["move_interval"]);
		active_mobs[id]["position_key"] = target_field;
		return;
	}
	//active_mobs[id][] = movement_counter+1;
}

function switch_mob_canvas(id, new_object)
{
	//debugger;
	var mob_objects = mob_canvas_objects[id];
	for ( var key in mob_objects )
	{
		var current_obj = mob_objects[key];
		if ( current_obj == new_object )
		{
			current_obj.style.display = "";
		}
		else
		{
			current_obj.style.display = "none";
		}
	}
}

function start_mob_movement(id)
{
	//debugger;
	var current_field = active_mobs[id]["position_key"];
	var move_indicator = Math.floor((Math.random() * 2) + 1);
	if ( move_indicator == 2 )
	{
		var mob_log = document.getElementById("mob_log");
		var mob_log_content = mob_log.innerHTML;
		
		var direction_index = Math.floor((Math.random() * 3) + 0);
		var direction_to_move = mob_move_directions[direction_index];
		var target_field = get_target_field(current_field, direction_to_move);
		var current_datetime = new Date();
		for ( var mob_id in active_mobs )
		{
			if ( active_mobs[mob_id] == undefined )
			{
				continue;
			}
			var mob_position = active_mobs[mob_id]["position_key"];
			if ( mob_position == target_field )
			{
				mob_log.innerHTML = mob_log_content+"<br>"+current_datetime.getHours()+":"+current_datetime.getMinutes()+" mob("+id+"): kann nicht nach "+direction_to_move+", da ist schon jemand!";
				active_mobs[id]["move_timeout"] = setTimeout(start_mob_movement, 5000, id);
				return;
			}
		}
		if ( target_field == player_object["position_key"] )
		{
			mob_log.innerHTML = mob_log_content+"<br>"+current_datetime.getHours()+":"+current_datetime.getMinutes()+" mob("+id+"): kann nicht nach "+direction_to_move+", da ist gerade der player!";
			active_mobs[id]["move_timeout"] = setTimeout(start_mob_movement, 5000, id);
			return;
		}
		var animation_phases = 2;
		if ( direction_to_move == "left" || direction_to_move == "right" )
		{
			animation_phases = 3;
		}
		mob_log.innerHTML = mob_log_content+"<br>"+current_datetime.getHours()+":"+current_datetime.getMinutes()+" mob("+id+"): laufe nach "+direction_to_move+"...";
		move_mob(id, current_field, target_field, direction_to_move);
	}
	active_mobs[id]["move_timeout"] = setTimeout(start_mob_movement, 5000, id);
}

function init_mob()
{
	/*if ( active_mob_positions.length >= 5 )
	{
		console.log("Es sind bereits 5 Mobs aktiv, mach die erstmal weg!");
		return;
	}*/
	var current_player_field = current_field_from_above;
	var p_row = parseInt(current_player_field.split(",")[0]);
	var p_col = parseInt(current_player_field.split(",")[1]);
	var min_row = p_row-1;
	var min_col = p_col-1;
	var max_row = p_row+1;
	var max_col = p_col+1;
	//var player_safe_zone = [(p_row-1)+","+(p_col-1), (p_row-1)+","+p_col, (p_row-1)+","+(p_col+1),  p_row+","+(p_col-1), p_row+","+p_col, p_row+","+(p_col+1), (p_row+1)+","+(p_col-1), (p_row+1)+","+p_col, (p_row+1)+","+(p_col+1)];
	var player_safe_zone = [];
	for ( var current_row = min_row; current_row <= max_row; current_row++ )
	{
		for ( var current_col = min_col; current_col <= max_col; current_col++ )
		{
			player_safe_zone.push(current_row+","+current_col);
		}
	}
	var mob_spawn_key = undefined;
	while ( true )
	{
		var new_key = generate_random_position_key()
		//console.log(new_key);
		if ( $.inArray(new_key, player_safe_zone) != -1 )
		{
			continue;
		}
		for ( var mob_id in active_mobs )
		{
			if ( active_mobs[mob_id] == undefined )
			{
				continue;
			}
			var mob_position = active_mobs[mob_id]["position_key"];
			if ( mob_position == new_key )
			{
				console.log("kann auf "+new_key+" keinen mob spawnen, da dort schon einer steht");
				continue;
			}
		}
		mob_spawn_key = new_key;
		break;
	}
	spawn_mob(mob_spawn_key);
}

function spawn_mob(position_key)
{
	var mob_log = document.getElementById("mob_log");
	var mob_log_content = mob_log.innerHTML;
	
	var mob_x = grid_from_above[position_key][0];
	var mob_y = grid_from_above[position_key][1];
	var mob_drawing_object = document.createElement("div");
	mob_drawing_object.style.position = "absolute";
	mob_drawing_object.style.top = mob_y+y_offset;
	mob_drawing_object.style.left = mob_x+x_offset;
	active_mobs[last_id] = {"position_key":position_key, "face_direction":"down", "div":mob_drawing_object, "animation_interval":undefined, "move_interval":undefined, "move_timeout":undefined};
	mob_log.innerHTML = mob_log_content+"<br>mob("+last_id+") spawn auf feld "+position_key;
	mob_canvas_objects[last_id] = {};
	for ( var ccount = 0; ccount < 12; ccount++ )
	{
		var mob_canvas = document.createElement("canvas");
		//active_mobs[last_id][drawings[ccount]] = mob_canvas;
		mob_canvas_objects[last_id][drawings[ccount]] = mob_canvas;
		//mob_canvas.id = "mob_move_"+drawings[ccount];
		//mob_canvas.style = "position:absolute;";
		mob_canvas.width = 40;
		mob_canvas.height = 40;
		var c_img = new Image();
		c_img.canvas = mob_canvas;
		c_img.onload = function() {
			var cc = this.canvas.getContext("2d");
			cc.drawImage(this,0,0,40,40);
		};
		c_img.src = "images/dummy_sprite_"+drawings[ccount]+"_bandana.png";
		if ( drawings[ccount] != "down0" )
		{
			mob_canvas.style.display = "none";
		}
		
		//mob_canvas.style.display = "none";
		mob_drawing_object.appendChild(mob_canvas);
	}
	document.body.appendChild(mob_drawing_object);
	active_mobs[last_id]["move_timeout"] = setTimeout(start_mob_movement, 5000, last_id);
	last_id = last_id+1;
}

function stop_all_running_mobs()
{
	for ( var id in active_mobs )
	{
		var element = active_mobs[id]["div"];
		element.remove();
		if ( active_mobs[id]["move_interval"] != undefined )
		{
			clearInterval(active_mobs[id]["move_interval"]);
		}
		if ( active_mobs[id]["animation_interval"] != undefined )
		{
			clearInterval(active_mobs[id]["animation_interval"]);
		}
		if ( active_mobs[id]["move_timeout"] != undefined )
		{
			clearTimeout(active_mobs[id]["move_timeout"]);
		}
	}
	active_mobs = {};
	mob_canvas_objects = {};
	last_id = 0;
}

function despawn_mob(id)
{
	//debugger;
	var mob_log = document.getElementById("mob_log");
	var mob_log_content = mob_log.innerHTML;
	mob_log.innerHTML = mob_log_content+"<br>mob("+id+") despawned";
	var mob = active_mobs[id]["div"];
	if ( active_mobs[id]["move_interval"] != undefined )
	{
		clearInterval(active_mobs[id]["move_interval"]);
	}
	if ( active_mobs[id]["animation_interval"] != undefined )
	{
		clearInterval(active_mobs[id]["animation_interval"]);
	}
	if ( active_mobs[id]["move_timeout"] != undefined )
	{
		clearTimeout(active_mobs[id]["move_timeout"]);
	}
	mob.remove();
	active_mobs[id] = undefined;
	mob_canvas_objects[id] = undefined;
}

function generate_random_position_key()
{
	var random_row = Math.floor((Math.random() * 9) + 1);
	var random_col = Math.floor((Math.random() * 9) + 1);
	var random_key = random_row+","+random_col;
	return random_key;
}
