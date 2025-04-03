extends Node
#class_name DamageComponent

@export var source: Actor
@export var damage: int

@onready var actor: Actor = get_parent()
