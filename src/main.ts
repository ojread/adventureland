import * as ex from "excalibur";
// import { ExcaliburAStar } from "@excaliburjs/plugin-pathfinding";
import { TiledResource } from "@excaliburjs/plugin-tiled";

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
    entityClassNameFactories: {
        // "player": (props: FactoryProps) => {
        //     return new Player(
        //         props.worldPos
        //     );
        // },
        // "npc": (props: FactoryProps) => {
        //     console.log("npc", props);
        //     return new Character();
        // }
    }
});
loader.addResource(tiledMap);

// class Player extends ex.Actor {
//     private movementSpeed: number = 64; // pixels per second
//     private currentPath: ex.Vector[] = [];
//     private pathfindingGraph: ExcaliburAStar;

//     constructor(pos: ex.Vector, tilemap: ex.TileMap) {
//         super({
//             pos,
//             width: 16,
//             height: 16,
//         });
//         this.pathfindingGraph = new ExcaliburAStar(tilemap);
//     }

//     setPath(path: ex.Vector[]) {
//         this.currentPath = path;
//         this.followPath();
//     }

//     private followPath() {
//         if (this.currentPath.length === 0) return;

//         const nextPoint = this.currentPath.shift()!;
//         this.actions.clearActions();

//         // Calculate duration based on distance and speed
//         const distance = this.pos.distance(nextPoint);
//         const duration = (distance / this.movementSpeed) * 1000; // ms

//         this.actions.moveTo(nextPoint, duration).callMethod(() => this.followPath());
//     }
// }

// class Character extends ex.Actor {

// }

// class MovementComponent extends ex.Component {
//     constructor(public target: ex.Vector) {
//         super();
//     }
// }

// class MovementSystem extends ex.System {
//     query: ex.Query<typeof MovementComponent>;

//     constructor(world: ex.World) {
//         super();
//         this.query = world.query([MovementComponent]);
//     }

//     public priority = 99;   // Low priority

//     public systemType = ex.SystemType.Update;

//     public update(delta: number) {

//     }
// }

class MoveCommand extends ex.Component {
    public readonly type = "movement-command";

    constructor(public target: ex.Vector, public speed: number = 100) {
        super();
    }
}

export class Movable extends ex.Component {
    public readonly type = "movable";

    constructor(public speed: number = 100) {
        super();
    }
}
export class MovementSystem extends ex.System {
    query: ex.Query<typeof MoveCommand | typeof Movable>;

    constructor(world: ex.World) {
        super();
        this.query = world.query([Movable, MoveCommand]);
    }

    public systemType = ex.SystemType.Update;

    public update(delta: number) {
        for (let entity of this.query.entities) {
            const target = entity.get(MoveCommand).target;
            const actor = entity as ex.Actor;
            actor.actions.clearActions();
            actor.actions.moveTo(target, 100);
            entity.removeComponent(MoveCommand);
        }
    }

    // query: ex.Query<typeof Movable | MoveCommand>(["A", "B"]);

    // public readonly types = ["movable", "movement-command"] as const;
    // public systemType = ex.SystemType.Update;

    // private graph: ExcaliburAStar;

    // constructor(private tilemap: ex.TileMap) {
    //     super();
    //     this.graph = new ExcaliburAStar(tilemap);
    // }

    // public update(delta: number): void {
    //     for (const entity of this.  .query.entities) {
    //         const command = entity.get(MoveCommand);
    //         if (command) {
    //             this.processMovement(entity, command);
    //             entity.removeComponent(MoveCommand); // Remove after processing
    //         }
    //     }
    // }

    // private processMovement(entity: ex.Actor, command: MoveCommand): void {
    //     const startTile = this.tilemap.getTileByPoint(entity.pos);
    //     const endTile = this.tilemap.getTileByPoint(command.target);

    //     if (startTile && endTile) {
    //         entity.actions.clearActions();

    //         const startNode = this.graph.getNodeByCoord(startTile.x, startTile.y);
    //         const endNode = this.graph.getNodeByCoord(endTile.x, endTile.y);
    //         const path = this.graph.astar(startNode, endNode);

    //         for (const step of path) {
    //             const tile = this.tilemap.getTile(step.x, step.y);
    //             if (tile) {
    //                 entity.actions.moveTo(tile.pos, command.speed);
    //             }
    //         }

    //         this.graph.resetGrid();
    //     }
    // }
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
    // const tilemap = solidLayer.tilemap as ex.TileMap;
    // const graph = new ExcaliburAStar(tilemap);

    // Create and add the movement system
    // const movementSystem = new MovementSystem(game.);
    game.currentScene.world.add(MovementSystem);

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

        // const startTile = tilemap.getTileByPoint(player.pos);
        // const endTile = tilemap.getTileByPoint(event.coordinates.worldPos);

        // if (startTile && endTile) {
        //     // Clear previous actions first
        //     player.actions.clearActions();

        //     const startNode = graph.getNodeByCoord(startTile.x, startTile.y);
        //     const endNode = graph.getNodeByCoord(endTile.x, endTile.y);
        //     const path = graph.astar(startNode, endNode);

        //     // Convert path to movement actions
        //     for (const step of path) {
        //         const tile = tilemap.getTile(step.x, step.y);
        //         if (tile) {
        //             player.actions.moveTo(tile.pos, 100);
        //         }
        //     }

        //     // Explicitly clean up
        //     graph.resetGrid();
        //     path.length = 0; // Clear the path array
        // }
    });
});
