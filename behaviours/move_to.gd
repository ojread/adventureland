extends ActionLeaf

@export var target: Vector2

func tick(actor, _blackboard):
	if actor.nav.is_target_reached():
		print("done")
		return SUCCESS
		
	if actor.cant_do_your_action:
		return FAILURE
	
	print("Moving to ", target)
	actor.set_target_position(target)
	return RUNNING
