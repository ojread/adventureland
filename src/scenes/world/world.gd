extends Node2D

# Handle level loading and game events.

var level: Level
var player: GridEntity

func _ready() -> void:
	Events.entity_clicked.connect(_on_entity_clicked)
	Events.level_clicked.connect(_on_level_clicked)
	Events.entity_bumped.connect(_on_entity_bumped)
	load_level("res://scenes/levels/level_1.tscn")

func _on_entity_clicked(entity: GridEntity) -> void:
	if entity.name != "Player":
		#var player = level.get_node("Player") as GridEntity
		player.set_target_entity(entity)
	
	#if entity.timeline.length() > 0 and not Dialogic.current_timeline:
		#Dialogic.start(entity.timeline)
	
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

func _on_level_clicked(cell: Vector2i) -> void:
	#var player = level.get_node("Player") as GridEntity
	player.set_target_grid(cell)

func _on_entity_bumped(entity: GridEntity) -> void:
	if entity.timeline.length() > 0 and not Dialogic.current_timeline:
		Dialogic.start(entity.timeline)

#func _input(event: InputEvent):
	## check if a dialog is already running
	#if Dialogic.current_timeline != null:
		#return
#
	#if event is InputEventKey and event.keycode == KEY_ENTER and event.pressed:
		#Dialogic.start('chat')
		#get_viewport().set_input_as_handled()

func load_level(level_path: String) -> void:
	var level_scene = load(level_path)
	var new_level = level_scene.instantiate()
	add_child(new_level)
	if level:
		player = level.get_node("Player")
		player.reparent(new_level)
		level.queue_free()
	level = new_level
	player = level.get_node("Player")
	
