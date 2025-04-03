extends Node2D

@onready var map = $Map

var selected_actors: Array[Actor] = []
var targeted_actor: Actor

func _ready():
	# Listen for clicks on actors.
	for child in get_children():
		if child is Actor:
			#child.connect("clicked", _on_actor_clicked)
			child.connect("mouse_entered_actor", _on_mouse_entered_actor)
			child.connect("mouse_exited_actor", _on_mouse_exited_actor)

func _process(delta: float) -> void:
	# Run all the "systems" that update each frame.
	# Character controllers receive things that they're aware of.
	# It might be better to handle clicks here so I know the order of things.
	
	var tree = get_tree()
	var damage_components = tree.get_nodes_in_group("Damage")
	for damage_component in damage_components:
		damage_component.actor.receive_damage(damage_component.damage)
		#damage_component.actor.hp -= damage_component.damage
		#if damage_component.actor.hp <= 0:
			#damage_component.actor.queue_free()
		#else:
		damage_component.queue_free()
	
	# Check for deaths.
	# Is this inefficient to run every frame?
	var actors = tree.get_nodes_in_group("Actor")
	for actor in actors:
		if actor.hp <= 0:
			# Deselect it if necessary.
			_on_mouse_exited_actor(actor)
			targeted_actor = null
			actor.queue_free()
	
	if targeted_actor:
		$Target.position = targeted_actor.position
		$Target.visible = true
	else:
		$Target.visible = false


# Get player input and decide what to do with it.
# Non solid tile - tell player to move there.
# Interactive tile - tell player to move next to it and perform interaction.
# NPC - tell player to move into range and open dialog.
# Enemy tell player to move into range depending on weapon and attack.

func _input(event):
	if event is InputEventMouseButton:
		if event.is_released() and event.button_index == MOUSE_BUTTON_LEFT:
			
			#var selected_actors = get_tree().get_nodes_in_group("Selected").map(func(component):
				#return component.get_parent()
			#)
			if selected_actors:
				var selected_actor = selected_actors.front()
				# Move player towards actor and interact when in range.
				get_tree().call_group("PlayerController", "attack_actor", selected_actor)
				targeted_actor = selected_actor
				#print(selected_actor)
			else:
			
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

# Actors need brains, state machines or something to handle deciding an overall
# intention, turning that into individual instructions and then folloing them.
# You have to move into range of something to interact.
# And if the target moves, update the instructions to follow.

func _on_mouse_entered_actor(actor: Actor):
	selected_actors.append(actor)

func _on_mouse_exited_actor(actor: Actor):
	var index = selected_actors.find(actor)
	if index > -1:
		selected_actors.remove_at(index)
