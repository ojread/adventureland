import { Actor, Query, System, SystemType, TileMap, World } from "excalibur";
import { ExcaliburAStar } from "@excaliburjs/plugin-pathfinding";
import { MoveCommand, Movable } from "./components";

export default class MovementSystem extends System {
    query: Query<typeof MoveCommand | typeof Movable>;
    private graph: ExcaliburAStar;
    private tilemap: TileMap;

    constructor(world: World, graph: ExcaliburAStar, tilemap: TileMap) {
        super();
        this.query = world.query([Movable, MoveCommand]);
        this.graph = graph;
        this.tilemap = tilemap;
    }

    public systemType = SystemType.Update;

    public update(delta: number) {
        for (let entity of this.query.entities) {
            const target = entity.get(MoveCommand).target;
            // const movable = entity.get(Movable);
            const actor = entity as Actor;

            const startTile = this.tilemap.getTileByPoint(actor.pos);
            const endTile = this.tilemap.getTileByPoint(target);

            if (startTile && endTile) {

                const startNode = this.graph.getNodeByCoord(startTile.x, startTile.y);
                const endNode = this.graph.getNodeByCoord(endTile.x, endTile.y);

                if (startNode && endNode) {
                    const path = this.graph.astar(startNode, endNode);
                    actor.actions.clearActions();

                    // Move along the path
                    for (const step of path) {
                        const targetPos = this.tilemap.getTile(step.x, step.y)?.pos;

                        // const distance = actor.pos.distance(targetPos);
                        const duration = 100;
                        if (targetPos) {
                            actor.actions.moveTo(targetPos, duration);
                        }
                    }

                    // Clean up
                    this.graph.resetGrid();
                }
            }

            entity.removeComponent(MoveCommand);
        }
    }
}