extends ActionLeaf

@export var target_actor: Actor

func tick(actor, _blackboard):
	actor.set_target_position(target_actor.position, true)
	
	if actor.nav.is_navigation_finished():
		return SUCCESS
	#if actor.cant_do_your_action:
		#return FAILURE
	else:
		return RUNNING
