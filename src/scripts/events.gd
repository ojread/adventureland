# Global event bus.
extends Node

signal entity_clicked(entity: GridEntity)
signal level_clicked(cell: Vector2i)
signal entity_bumped(entity: GridEntity)
signal entity_target_grid_changed(entity: GridEntity)
signal entity_target_entity_changed(entity: GridEntity)
signal entity_movement_ended(entity: GridEntity)
