extends Node
class_name PlayerControllerComponent

var DamageComponent = preload("res://components/damage.tscn")

@onready var actor: Actor = get_parent()

var state := "idle"
var target: Actor

#func attack_actor(_target: Actor):
	#state = "attack"
	#target = _target
	#print("Attacking ", target.name)
	#actor.set_target_position(target.position)

#func _process(delta: float) -> void:
	#if state == "attack" and target:
		#if actor.position.distance_to(target.position) <= actor.attack_range:
			#target.receive_damage(actor.attack)
	#state = "idle"
