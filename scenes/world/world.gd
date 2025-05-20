extends Node2D

@onready var map = $Map

var selected_actors: Array[Actor] = []
var player: Actor

func _ready():
	player = get_tree().get_first_node_in_group("PlayerController").actor
	
	# Listen for clicks on actors.
	for child in $Map.get_children():
		if child is Actor:
			child.connect("clicked", on_actor_clicked)
			child.connect("die", on_actor_died)

#func _process(delta: float) -> void:
	# Run all the "systems" that update each frame.
	# Character controllers receive things that they're aware of.
	# It might be better to handle clicks here so I know the order of things.

	
	# Show crosshair over target - doesn't look great.
	#if targeted_actor:
		#$Target.position = targeted_actor.position
		#$Target.visible = true
	#else:
		#$Target.visible = false

# Get player input and decide what to do with it.
# Non solid tile - tell player to move there.
# Interactive tile - tell player to move next to it and perform interaction.
# NPC - tell player to move into range and open dialog.
# Enemy tell player to move into range depending on weapon and attack.

func _unhandled_input(event: InputEvent) -> void:
	# Handle clicks on the map.
	if event.is_action_pressed("click"):
		var global_mouse_pos = get_global_mouse_position()
		var map_coords = map.local_to_map(global_mouse_pos)
		
		if map.cell_is_interactive(map_coords):
			map.interact_with_cell(map_coords)
		else:
			# Move the player towards the clicked point.
			player.set_target_position(global_mouse_pos)
			
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

# Actors need brains, state machines or something to handle deciding an overall
# intention, turning that into individual instructions and then folloing them.
# You have to move into range of something to interact.
# And if the target moves, update the instructions to follow.

func on_actor_clicked(actor: Actor):
	# Move player towards actor and interact when in range.
	# Don't target yourself.
	if actor != player:
		player.set_target_actor(actor)
	
func on_actor_died(actor: Actor):
	actor.queue_free()
