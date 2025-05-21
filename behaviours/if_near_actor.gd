extends ConditionLeaf

@export var target_actor: Actor
@export var range: float

func tick(actor, _blackboard):
	if actor.position.distance_to(target_actor.position) < range:
		return SUCCESS
	else:
		return FAILURE
