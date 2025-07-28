extends Control

@onready var panel_title = $HBoxContainer/PanelContainer/Panel/MarginContainer/VBoxContainer/VBoxContainer/Title
@onready var buttons = $HBoxContainer/PanelContainer/Panel/MarginContainer/VBoxContainer/VBoxContainer/Buttons
@onready var feedback = $HBoxContainer/PanelContainer/Panel/MarginContainer/VBoxContainer/Feedback

"""
UI concepts
Interact like a Bioware RPG, all through dialoge with options. So when you click
an object, the player walks over to it and dialogue begins. A title and brief 
description, common options like examine and unique options like flush. Click 
one to perform that action or explore a dialogue tree. There might be an addon
to deal with this nicely.
This one looks incredible - https://github.com/dialogic-godot/dialogic
It works extremely well! It could literally handle the guts of the game.
All interactions are done though this dialogue. Thomas is fully up for a
"gentle" game where you just explore the world and everything in it.
Could it even handle a simple combat system? I foresee a lot of puzzle-like
interactions like creatures that can only be beaten by a certain weapon etc.
Lots of easter eggs hidden away for when you try weird things obviously.
Important to Thomas is earning money and spending it in a shop. Your equipment
will affect the way you approach things.
"""

func _ready() -> void:
	Events.entity_clicked.connect(_on_entity_clicked)

func _on_entity_clicked(entity: GridEntity):
	#print(entity.name)
	if entity.timeline.length() > 0 and not Dialogic.current_timeline:
		Dialogic.start(entity.timeline)
		#Dialogic.start(entity.name as String)
		#print(entity.dialogic_timeline, " ", entity.dialogic_character)
		#var layout = Dialogic.start(entity.dialogic_timeline)
		#layout.register_character(entity.dialogic_character, entity)
	#panel_title.text = entity.name
	#for button in buttons.get_children():
		#button.queue_free()
	#for component in entity.get_children():
		#if component is ActionComponent:
			#var button = Button.new()
			#button.text = component.title
			#button.pressed.connect(func ():
				#var result = component.on_pressed()
				#feedback.text += "\n" +  result
			#)
			#buttons.add_child(button)

#func _input(event: InputEvent):
	## check if a dialog is already running
	#if Dialogic.current_timeline != null:
		#return
#
	#if event is InputEventKey and event.keycode == KEY_ENTER and event.pressed:
		#Dialogic.start('chat')
		#get_viewport().set_input_as_handled()
