extends ActionLeaf

@export var range: int

func tick(actor, _blackboard):
	if actor.nav.is_navigation_finished():
		print("finished")
		return SUCCESS
		
	#if actor.cant_do_your_action:
		#return FAILURE
		
	var start_pos = actor.position
	var x = randf_range(start_pos.x - range, start_pos.x + range)
	var y = randf_range(start_pos.y - range, start_pos.y + range)
	
	_blackboard.target_pos = Vector2(x, y)
	
	print("Moving to ", _blackboard.target_pos)
	actor.set_target_position(Vector2(x, y))

	return RUNNING
