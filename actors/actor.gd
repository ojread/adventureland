extends CharacterBody2D
class_name Actor

# Methods useful for all actors in the game

signal clicked(actor: Actor)
signal die(actor: Actor)

@export var speed := 50.0
@export var hp := 10
@export var max_hp := 10
@export var attack := 2
@export var attack_range := 16
@export var attack_speed := 1
@export var target_actor: Actor = null

@onready var nav: NavigationAgent2D = $NavigationAgent2D

var health_bar_start_pos = Vector2(-8, -8)
var health_bar_end_pos = Vector2(8, -8)

var can_attack: bool = true

func _process(delta: float) ->void:
	# Move toward the target actor if set.
	if target_actor:
		set_target_position(target_actor.position, true)
		
		if position.distance_to(target_actor.position) < attack_range:
			if can_attack:
				target_actor.receive_damage(attack)
				can_attack = false
				$AttackTimer.start(1)

func _draw() -> void:
	_draw_health_bar()

func _draw_health_bar() -> void:
	if hp < max_hp:
		var x = -8 + 16 * hp / max_hp
		var health_bar_mid_pos = Vector2(x, -8)
		draw_line(health_bar_start_pos, health_bar_mid_pos, Color.GREEN, 1)
		draw_line(health_bar_mid_pos, health_bar_end_pos, Color.RED, 1)

func _physics_process(delta: float) -> void:
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
		_on_navigation_agent_2d_velocity_computed(new_velocity)

	# Do the movement
	move_and_slide()

func set_target_position(target: Vector2, is_actor: bool = false):
	# Tell the navigation agent to move toward the position.
	nav.target_position = target
	
	# Desired distance from target is different for actors.
	if is_actor:
		nav.target_desired_distance = 16
	else:
		nav.target_desired_distance = 4

func set_target_actor(target: Actor):
	# Don't target yourself!
	if target_actor != self:
		target_actor = target

func receive_damage(damage: int):
	hp -= damage
	if hp <= 0:
		die.emit(self)
	queue_redraw()

func _input_event(viewport: Viewport, event: InputEvent, shape_idx: int) -> void:
	if event.is_action_pressed("click"):
		viewport.set_input_as_handled()
		#print("actor clicked")
		clicked.emit(self)

func _on_navigation_agent_2d_velocity_computed(safe_velocity: Vector2) -> void:
	velocity = safe_velocity

func _on_attack_timer_timeout() -> void:
	# Ready to attack.
	can_attack = true
