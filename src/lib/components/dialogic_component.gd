extends ActionComponent

@export var timeline: String

func _ready() -> void:
	title = "Flush"

func on_pressed() -> String:
	return "You flush the toilet."
