class_name ActionComponent extends Node

var title: String = "Default title"

@onready var entity: GridEntity = get_parent()

# Override this...
func on_pressed() -> String:
	#print("Action ", title)
	return "Override this..."
