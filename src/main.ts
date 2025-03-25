import * as ex from "excalibur";
import { ExcaliburAStar } from "@excaliburjs/plugin-pathfinding";
import { FactoryProps, TiledResource } from "@excaliburjs/plugin-tiled";

const game = new ex.Engine({
    width: 320,
    height: 320,
    backgroundColor: ex.Color.fromHex("#000000"),
    pixelArt: true,
    pixelRatio: 2,
    displayMode: ex.DisplayMode.FitScreenAndFill,
});

// Load assets
const loader = new ex.Loader();

// Load the tile sheet
const tileSheetSource = new ex.ImageSource("/assets/tiles.png");
loader.addResource(tileSheetSource);

const tiledMap = new TiledResource("/maps/world.json", {
    entityClassNameFactories: {
        "player": (props: FactoryProps) => {
            return new Player(
                props.worldPos
            );
        }
    }
});
loader.addResource(tiledMap);

class Player extends ex.Actor {
    constructor(pos: ex.Vector) {
        super({
            pos,
            width: 16,
            height: 16,
        });
    }
}

// Start the game after loading assets
game.start(loader).then(() => {
    // Once assets are loaded, create a scene and add sprites

    tiledMap.addToScene(game.currentScene);

    const solidLayers = tiledMap.getLayersByProperty("solid", true);

    // Check a solid layer was found
    if (solidLayers.length === 0) {
        console.error('No solid layers found in the map');
        return;
    }

    // Type-safe way to access the tilemap
    const solidLayer = solidLayers[0];
    if (!('tilemap' in solidLayer)) {
        console.error('The solid layer is not a tile layer');
        return;
    }

    // Now TypeScript knows this is a TileMap
    const tilemap = solidLayer.tilemap as ex.TileMap;
    const graph = new ExcaliburAStar(tilemap);

    // Create a sprite sheet
    const tileSheet = ex.SpriteSheet.fromImageSource({
        image: tileSheetSource,
        grid: {
            columns: 49,
            rows: 22,
            spriteHeight: 16,
            spriteWidth: 16
        }
    });

    // Look up the player entity.
    const player = tiledMap.getEntitiesByName("player")[0] as Player;

    // Camera follows player
    game.currentScene.camera.strategy.elasticToActor(player, 0.1, 0.5);

    // Subscribe to the primary pointer
    game.input.pointers.primary.on('down', function (event) {
        const startTile = tilemap.getTileByPoint(player.pos);
        const endTile = tilemap.getTileByPoint(event.coordinates.worldPos);
        if (startTile && endTile) {
            const startNode = graph.getNodeByCoord(startTile.x, startTile.y);
            const endNode = graph.getNodeByCoord(endTile.x, endTile.y);
            const path = graph.astar(startNode, endNode);

            player.actions.clearActions();
            for (const step of path) {
                const tile = tilemap.getTile(step.x, step.y);
                if (tile) {
                    player.actions.moveTo(tile.pos, 100);
                }
            }

            graph.resetGrid();
        }
    });
});
