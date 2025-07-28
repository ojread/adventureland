class_name Level extends TileMapLayer

var entities: Dictionary[Vector2i, GridEntity] = {}

@onready var nav: AStarGrid2D = AStarGrid2D.new()

func _ready() -> void:
	# Set up the AStarGrid2D
	nav.region = get_used_rect()
	nav.cell_size = Vector2(Globals.tile_size, Globals.tile_size)
	nav.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_ONLY_IF_NO_OBSTACLES
	nav.update()
	init_tiles()
	init_entities()
	
	# Connect entity signals through the event bus.
	Events.entity_movement_target_changed.connect(move_entity)
	Events.entity_movement_ended.connect(move_entity)

func init_tiles() -> void:
	for cell in get_used_cells():
		var tile_data: TileData = get_cell_tile_data(cell)
		var walkable: bool = tile_data.get_custom_data("walkable")
		nav.set_point_solid(cell, not walkable)

func init_entities() -> void:
	entities = {}
	for child in get_children():
		if child is GridEntity:
			nav.set_point_solid(child.grid, true)
			entities[child.grid] = child

# Attempt to move the entity, updating the dictionary and astargrid.
func move_entity(entity: GridEntity) -> void:
	if not entity.moving and entity.movement_target != entity.grid:
		var path = get_nav_path(entity.grid, entity.movement_target)
		if path.size() > 0:
			nav.set_point_solid(entity.grid, false)
			entities[entity.grid] = null
			nav.set_point_solid(path[0], true)
			entities[path[0]] = entity
			entity.move_to(path[0])

# Find the shortest path between the two points.
func get_nav_path(from: Vector2i, to: Vector2i) -> Array[Vector2i]:
	var path = nav.get_id_path(from, to, true)
	# Remove the first element as it's the same as from. 
	if path and path.size() > 0:
		path.pop_front()
	return path

# Deal with all clicks on the map and entities centrally.
func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("click"):
		var cell = local_to_map(get_local_mouse_position())
		# Is there an entity at this cell?
		if entities.has(cell) and entities[cell] != null:
			Events.entity_clicked.emit(entities[cell])
		else:
			$Player.path_to(cell)
		get_viewport().set_input_as_handled()
