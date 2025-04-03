extends Node

# A Non-player character or enemy.
# Handle all the various behaviours that characters need.

#enum states {IDLE, }

#var state = "idle"

@export var wander_range := 32

@onready var timer = $Timer
@onready var actor: Actor = get_parent()
@onready var start_pos = actor.position

func _ready() -> void:
	_wait()

func _wait() -> void:
	timer.wait_time = randf_range(1.0, 2.0)
	timer.connect("timeout", _wander)
	timer.start()

func _wander() -> void:
	# Move to a point near the start position.
	var x = randf_range(start_pos.x - wander_range, start_pos.x + wander_range)
	var y = randf_range(start_pos.y - wander_range, start_pos.y + wander_range)
	actor.set_movement_target(Vector2(x, y))
