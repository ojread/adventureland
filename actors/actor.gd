extends CharacterBody2D
class_name Actor

# Methods useful for all actors in the game

# Allow the game to track what we're clicking.
signal mouse_entered_actor(actor: Actor)
signal mouse_exited_actor(actor: Actor)

@export var speed := 50.0
@export var hp := 10
@export var max_hp := 10
@export var attack := 2
@export var attack_range := 16
@export var attack_speed := 1

@onready var nav: NavigationAgent2D = $NavigationAgent2D # change if needed

var health_bar_start_pos = Vector2(-8, -8)
var health_bar_end_pos = Vector2(8, -8)

func _ready() -> void:
	nav.velocity_computed.connect(_velocity_computed)

func _draw() -> void:
	_draw_health_bar()

func _draw_health_bar() -> void:
	if hp < max_hp:
		var x = -8 + 16 * hp / max_hp
		var health_bar_mid_pos = Vector2(x, -8)
		draw_line(health_bar_start_pos, health_bar_mid_pos, Color.GREEN, 1)
		draw_line(health_bar_mid_pos, health_bar_end_pos, Color.RED, 1)

func _physics_process(delta: float) -> void:
	_move()

func set_movement_target(target: Vector2):
	nav.target_position = target

func receive_damage(damage: int):
	hp -= damage
	#if hp <= 0:
		#queue_free()
	queue_redraw()

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

func _on_mouse_entered() -> void:
	mouse_entered_actor.emit(self)

func _on_mouse_exited() -> void:
	mouse_exited_actor.emit(self)
