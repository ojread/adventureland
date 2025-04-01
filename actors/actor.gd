extends CharacterBody2D
class_name Actor

# Methods useful for all actors in the game

@export var speed := 50.0

@onready var nav: NavigationAgent2D = $NavigationAgent2D # change if needed

func _ready() -> void:
	nav.velocity_computed.connect(_velocity_computed)

func set_movement_target(target: Vector2):
	nav.target_position = target

func _physics_process(delta: float) -> void:
	_move()

func _move() -> void:
	# If we're at the target, stop
	if nav.is_navigation_finished():
		return

	# Get pathfinding information
	var current_agent_position: Vector2 = global_position
	var next_path_position: Vector2 = nav.get_next_path_position()
	

	# Calculate the new velocity
	var new_velocity = current_agent_position.direction_to(next_path_position) * speed

	# Set correct velocity
	if nav.avoidance_enabled:
		nav.set_velocity(new_velocity)
	else:
		_velocity_computed(new_velocity)

	# Do the movement
	move_and_slide()

func _velocity_computed(safe_velocity: Vector2):
	velocity = safe_velocity
