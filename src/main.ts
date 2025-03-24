import * as ex from "excalibur";
import { ExcaliburAStar } from "@excaliburjs/plugin-pathfinding";
import { TiledResource } from "@excaliburjs/plugin-tiled";

import tilesheetUrl from "/assets/tiles.png";

import map1Url from "/maps/map1.json?url";

const game = new ex.Engine({
    width: 480,
    height: 480,
    // viewport: { width: 400, height: 300 },
    backgroundColor: ex.Color.fromHex("#000000"),
    pixelArt: true,
    pixelRatio: 3,
    displayMode: ex.DisplayMode.FitScreen,
});

// Load assets
const loader = new ex.Loader();

// Load the tile sheet
const tileSheetSource = new ex.ImageSource(tilesheetUrl);
loader.addResource(tileSheetSource);

const tiledMap = new TiledResource(map1Url);
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

    const solidMapLayers = tiledMap.getLayersByProperty("solid", true);
    const tilemap = solidMapLayers[0].tilemap as ex.TileMap;
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

    // Create a player actor
    const player = new Player(ex.vec(100, 100));

    // Add the player sprite to the player actor
    player.graphics.use(tileSheet.getSprite(25, 0));
    game.add(player);

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
                    player.actions.moveTo(tile.center, 100);
                }
            }
        }
    });
});

game.start();
