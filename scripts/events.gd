# Global event bus.
extends Node

signal entity_clicked(entity: GridEntity)
signal entity_movement_target_changed(entity: GridEntity)
signal entity_movement_ended(entity: GridEntity)
