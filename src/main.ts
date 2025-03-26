import * as ex from "excalibur";
import { ExcaliburAStar } from "@excaliburjs/plugin-pathfinding";
import { TiledResource } from "@excaliburjs/plugin-tiled";

import { MoveCommand, Movable } from "./lib/components";
import MovementSystem from "./lib/movement-system";

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
// Not currently needed.
// const tileSheetSource = new ex.ImageSource("/assets/tiles.png");
// loader.addResource(tileSheetSource);

const tiledMap = new TiledResource("/maps/world.json", {
    // This turns object types into specific entity types.
    // I favour composition over inheritance though so components are being
    // attached to entities below.
    // entityClassNameFactories: {
    // "player": (props: FactoryProps) => {
    //     return new Player(
    //         props.worldPos
    //     );
    // },
    // "npc": (props: FactoryProps) => {
    //     console.log("npc", props);
    //     return new Character();
    // }
    // }
});
loader.addResource(tiledMap);

// Start the game after loading assets
game.start(loader).then(() => {
    // Once assets are loaded, create a scene and add sprites

    // Add this to see collision boxes
    // game.currentScene.engine.showDebug(true);

    tiledMap.addToScene(game.currentScene);

    // The tiled map appears to get addedwith its top left at 0,0
    // It needs to align it's origin with the world's.

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



    // Get the solid layer's tilemap
    const tilemap = solidLayer.tilemap as ex.TileMap;

    // Create the pathfinding graph
    const graph = new ExcaliburAStar(tilemap);

    // Create and add the movement system
    const movementSystem = new MovementSystem(game.currentScene.world, graph, tilemap);
    game.currentScene.world.add(movementSystem);

    // Create a sprite sheet
    // Everything's being loaded through the tiled map currently.
    // const tileSheet = ex.SpriteSheet.fromImageSource({
    //     image: tileSheetSource,
    //     grid: {
    //         columns: 49,
    //         rows: 22,
    //         spriteHeight: 16,
    //         spriteWidth: 16
    //     }
    // });

    // Look up the player entity.
    const player = tiledMap.getEntitiesByName("player")[0] as ex.Actor;
    player.addComponent(new Movable());

    // Camera follows player
    game.currentScene.camera.strategy.elasticToActor(player, 0.1, 0.5);

    // Subscribe to the primary pointer
    game.input.pointers.primary.on('down', function (event) {
        const player = tiledMap.getEntitiesByName("player")[0];
        if (player) {
            player.addComponent(new MoveCommand(event.coordinates.worldPos));
        }
    });
});
