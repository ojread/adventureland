extends Node2D

var astar_grid : AStarGrid2D

@onready var map = $Map

func _ready():
	# Component methods can be called like this
	#get_tree().call_group("PlayerController", "hello", "there")
	pass


# Get player input and decide what to do with it.
# Non solid tile - tell player to move there.
# Interactive tile - tell player to move next to it and perform interaction.
# NPC - tell player to move into range and open dialog.
# Enemy tell player to move into range depending on weapon and attack.

func _input(event):
	if event is InputEventMouseButton:
		if event.is_released() and event.button_index == MOUSE_BUTTON_LEFT:
			var global_mouse_pos = get_global_mouse_position()
			var map_coords = map.local_to_map(global_mouse_pos)
			
			if map.cell_is_interactive(map_coords):
				map.interact_with_cell(map_coords)
			else:
				# Move the player towards the clicked point.
				get_tree().call_group("PlayerController", "move_to", global_mouse_pos)
			
			# The tilemap has to be at 0,0 or this will need offsetting.
			#var map_coords = map.local_to_map(event.position)
			#var tile_data = map.get_cell_tile_data(map_coords)
			#if tile_data:
				# We've clicked a tile.
				#get_tree().call_group("PlayerController", "move_to", map_coords * 16)
				
				# It ain't that simple, the component doesn't know the map contents.
				# Either calculate the path here or have the map itself supply it.
				# AI brains need to be provided with any external input such as 
				# what tiles and entities it can see etc.
				# An entity can't just get all that info itself.
				
