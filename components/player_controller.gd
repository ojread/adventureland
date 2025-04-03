extends Node
class_name PlayerControllerComponent

var DamageComponent = preload("res://components/damage.tscn")

@onready var actor: Actor = get_parent()

var state := "idle"
var target: Actor

func move_to(target: Vector2):
	actor.set_movement_target(target)

func attack_actor(_target: Actor):
	state = "attack"
	target = _target
	print("Attacking ", target.name)
	actor.set_movement_target(target.position)

func _process(delta: float) -> void:
	if state == "attack" and target:
		if actor.position.distance_to(target.position) <= actor.attack_range:
			#print(state, target)
#			# Attach a damage component or take the direct approach?
			target.receive_damage(actor.attack)
			#var damage_component = DamageComponent.instantiate()
			#damage_component.source = actor
			#damage_component.damage = actor.attack
			#target.add_child(damage_component)
	state = "idle"
