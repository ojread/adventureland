extends Node2D

@onready var actor: Actor = get_parent()

func move_to(target: Vector2):
	actor.set_movement_target(target)
