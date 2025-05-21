extends ConditionLeaf

func tick(actor, _blackboard):
	if actor.nav.is_navigation_finished():
		print("not moving")
		return SUCCESS
	else:
		return FAILURE
