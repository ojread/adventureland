extends TileMapLayer

var tile_names = {}

func _ready():
	#await get_tree().process_frame
	_init_tile_names()
	#print(tile_names)

func _init_tile_names():
	var source: TileSetAtlasSource = tile_set.get_source(0)
	var tiles_count = source.get_tiles_count()
	for i in range(tiles_count):
		var tile_id = source.get_tile_id(i)
		if source.get_tile_data(tile_id, 0).has_custom_data("name"):
			var tile_name = source.get_tile_data(tile_id, 0).get_custom_data("name")
			if name:
				tile_names[tile_name] = tile_id

func cell_is_interactive(coords: Vector2i):
	var tile_data = get_cell_tile_data(coords)
	var tile_name = tile_data.get_custom_data("name")
	return tile_name == "door_open" or tile_name == "door_closed"

func interact_with_cell(coords: Vector2i):
	var tile_data = get_cell_tile_data(coords)
	var tile_name = tile_data.get_custom_data("name")
	if tile_name == "door_closed":
		set_cell(coords, 0, tile_names["door_open"])
	if tile_name == "door_open":
		set_cell(coords, 0, tile_names["door_closed"])
