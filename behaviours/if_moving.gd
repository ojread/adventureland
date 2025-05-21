extends ConditionLeaf

func tick(actor, _blackboard):
	if actor.nav.is_navigation_finished():
		return FAILURE
	else:
		return SUCCESS
