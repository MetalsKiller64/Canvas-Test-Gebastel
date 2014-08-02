var running = false;		//bestimmt ob gerade eine Animation ausgeführt wird
var move_counter = 0;		//zählt wieviele Animations-Schritte bereits ausgeführt wurden
var animation_parts = 5;	//bestimmt wieviele Animations-Schritte ausgeführt werden sollen
var current_x = 0;			//aktuelle x-Koordinate des Chars
var current_y = 0;			//aktuelle y-Koordinate des Chars
var char_width = 40;
var char_height = 40;
var direction = null;		//Richtung der Char-Bewegung
var interval = null;		//Interval für Animationsphasen in ms
var face_direction = "down";

function move_char()
{
	/*Hier wird der char bewegt bzw. die Animationsphasen werden gemalt
	FIXME: Kann man beim Aufruf von setInterval() irgendwie Parameter an die aufgerufene Funktion übergeben?*/
	//console.log("move_char");
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
			//console.log("debug: "+move_counter);
			//image = get_image("images/dummy_sprite_"+direction+"_bandana1.png");
			image = get_image(char_file_name+"1.png");
		}
		else if ( move_counter >= 3 && move_counter <= 5 )
		{
			
			//console.log("debug: "+move_counter);
			image = get_image(char_file_name+"2.png");
		}
	}
	else
	{
		if ( move_counter >= 0 && move_counter <= 2 )
		{
			//console.log("debug: "+move_counter);
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
	
	//console.log("debug: "+move_counter);
	var old_x = current_x;
	var old_y = current_y;
	//Verschieben der Position des chars, wenn er an den Seiten das Canvas verlässt
	//TODO: Später will ich dieses Gedöhns ersetzen und stattdessen den Background bewegen und den char in der Mitte lassen (aber eins nach dem anderen...)
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
	if ( current_y > 380 )
	{
		current_y = 0;
	}
	else if ( current_y < 0 )
	{
		current_y = 360;
	}
	if ( current_x < 0 )
	{
		current_x = 440;
	}
	else if ( current_x > 480 )
	{
		current_x = 0;
	}
	//console.log(image.src);
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
	}
}

function get_image(file)
{
	img = new Image();
	img.src = file;
	return img;
}

function start_moving(move_direction)
{
	if ( face_direction != move_direction )
	{
		var turned_char = new Image();
		turned_char.src = "images/dummy_sprite_"+move_direction+"_bandana.png";
		canvas = document.getElementById("canvas");
		c = canvas.getContext("2d");
		c.clearRect(current_x, current_y, char_width, char_height);
		c.drawImage(turned_char, current_x, current_y, char_width, char_height);
		face_direction = move_direction;
		return;
	}
	face_direction = move_direction;
	if ( running == false )
	{
		running = true;
		direction = move_direction;
		//is_moving = true;
		interval = setInterval(move_char, 60);
	}
}
