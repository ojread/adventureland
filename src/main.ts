import * as ex from "excalibur";
import { ExcaliburAStar } from "@excaliburjs/plugin-pathfinding";
import { TiledResource } from "@excaliburjs/plugin-tiled";

import { Character, Dialog, MoveCommand, Movable } from "./lib/components";
import InteractionSystem from "./lib/interaction-system";
import MovementSystem from "./lib/movement-system";

const game = new ex.Engine({
    width: 256,
    height: 256,
    backgroundColor: ex.Color.fromHex("#000000"),
    pixelArt: true,
    pixelRatio: 3,
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

    // Add the tiled world to the scene.
    tiledMap.addToScene(game.currentScene);

    // Add the interaction system
    const interactionSystem = new InteractionSystem(game.currentScene.world);
    game.currentScene.world.add(interactionSystem);

    // Add dialog UI
    const dialog = new Dialog();
    game.currentScene.add(dialog);

    // Add character component to the chicken.
    const chicken = tiledMap.getEntitiesByName("chicken")[0];
    if (chicken) {
        chicken.addComponent(new Character({
            name: "Clucky",
            dialog: [
                "Cluck cluck! Welcome to Adventureland!",
                "Beware of the dark forest to the north.",
                "I heard there's treasure hidden in the caves."
            ]
        }));
    }

    // The tiled map appears to get addedwith its top left at 0,0
    // It needs to align it's origin with the world's.

    const groundLayers = tiledMap.getLayersByProperty("solid", true);
    const solidLayers = tiledMap.getLayersByProperty("solid", true);

    // Check a solid layer was found
    if (solidLayers.length === 0) {
        console.error('No solid layers found in the map');
        return;
    }

    // Check a ground layer was found
    if (groundLayers.length === 0) {
        console.error('No ground layers found in the map');
        return;
    }

    // Type-safe way to access the tilemap
    const solidLayer = solidLayers[0];
    if (!('tilemap' in solidLayer)) {
        console.error('The solid layer is not a tile layer');
        return;
    }

    const groundLayer = groundLayers[0];
    if (!('tilemap' in groundLayer)) {
        console.error('The ground layer is not a tile layer');
        return;
    }

    // Get the tilemaps for the ground and solid layers.
    // const groundTilemap = solidLayer.tilemap as ex.TileMap;
    const groundTilemap = groundLayer.tilemap as ex.TileMap;
    const solidTilemap = solidLayer.tilemap as ex.TileMap;

    // Create the pathfinding graph
    const graph = new ExcaliburAStar(solidTilemap);

    // Create and add the movement system
    const movementSystem = new MovementSystem(game.currentScene.world, graph, groundTilemap);
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
    game.input.pointers.primary.on('up', function (event) {
        // What have we clicked on?
        // Hard to find the target from here it seems.

        /* Ideas
        Interaction is part of movement - bump an object to use it.
        Part of stepping along the path is checking for objects.

        Actors listen for click events and attach a click component.
        Systems can react to this and handle the interaction.

        I think I prefer the former. Fairly simple. How would it handle
        attacking an enemy though?
        */

        const player = tiledMap.getEntitiesByName("player")[0];
        if (player) {
            player.addComponent(new MoveCommand(event.coordinates.worldPos));
        }
    });
});
