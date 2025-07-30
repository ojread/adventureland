class_name GridEntity extends Sprite2D

# An entity that lives on the grid with all the common functionality included.

@export var solid: bool = true
@export var timeline: String

#@export var dialogic_timeline: DialogicTimeline
#@export var dialogic_character: DialogicCharacter

var moving: bool = false

# The grid coords that the entitiy is considered to be at.
@onready var grid: Vector2i = (position / Globals.tile_size) as Vector2i#:

# Entities live directly under the level/tilemap. Best not to need this?
@onready var level: Level = get_parent()

# Set either of these targets and the level will move us.
@onready var target_grid: Vector2i = grid
@onready var target_entity: GridEntity = null

# Call to start following a new path to the target grid position.
func set_target_grid(new_target_grid: Vector2i) -> void:
	target_grid = new_target_grid
	target_entity = null
	Events.entity_target_grid_changed.emit(self)

# Call to move towards an entity and interact with it.
func set_target_entity(new_target_entity: GridEntity) -> void:
	target_entity = new_target_entity
	target_grid = grid
	Events.entity_target_entity_changed.emit(self)

# Slide entity to the target position.
func move_to(target: Vector2i) -> void:
	moving = true
	var target_position = (target * Globals.tile_size) as Vector2
	var tween = create_tween()
	tween.tween_property(self, "position", target_position, 0.2)
	tween.tween_callback(func():
		grid = target
		moving = false
		Events.entity_movement_ended.emit(self)
	)

# Immediately place at the grid position.
func place_at(grid_position: Vector2i):
	grid = grid_position
	position = grid * Globals.tile_size
	var camera = get_node("Camera2D") as Camera2D
	if camera:
		camera.reset_smoothing()
