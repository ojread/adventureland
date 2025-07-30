class_name WanderComponent extends Node

@onready var entity: GridEntity = get_parent()
@onready var wander_timer = $WanderTimer
@onready var initial_grid: Vector2i

@export var wander_distance: int = 1
@export var wander_time: float = 3.0

# This whole component is a bit dumb, doesn't take into account moving time.

func _ready() -> void:
	# Set the initial random timeout.
	reset_timer()
	# Grab the initial grid after everything's loaded.
	call_deferred("set_initial_grid")

func set_initial_grid() -> void:
	initial_grid = entity.grid

func reset_timer() -> void:
	wander_timer.wait_time = wander_time + randf_range(0.0, wander_time)

func _on_wander_timer_timeout() -> void:
	wander()
	reset_timer()

func wander() -> void:
	var dx = randi_range(-wander_distance, wander_distance)
	var dy = randi_range(-wander_distance, wander_distance)
	var wander_target = initial_grid + Vector2i(dx, dy)
	entity.set_target_grid(wander_target)
	
