class_name GridEntity extends Sprite2D

# An entity that lives on the grid with all the common functionality included.

@export var timeline: String

#@export var dialogic_timeline: DialogicTimeline
#@export var dialogic_character: DialogicCharacter

var moving: bool = false

# The grid coords that the entitiy is considered to be at.
@onready var grid: Vector2i = (position / Globals.tile_size) as Vector2i#:

# Entities live directly under the level/tilemap. Best not to need this?
@onready var level: Level = get_parent()

# Set this and the level will move us toward the target.
@onready var movement_target: Vector2i = grid

# Call to start following a new path to the target grid position.
func path_to(target: Vector2i) -> void:
	movement_target = target
	Events.entity_movement_target_changed.emit(self)

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
