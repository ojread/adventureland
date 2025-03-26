// src/systems/interactionSystem.ts
import * as ex from "excalibur";
import { Character, Dialog } from "./components";

export default class InteractionSystem extends ex.System {
    query: ex.Query<typeof Character>;

    public readonly types = ["npc"] as const;
    private dialog: Dialog;
    // private currentCharacter: ex.Entity | null = null;

    constructor(world: ex.World) {
        super();
        this.query = world.query([Character]);
        this.dialog = new Dialog();
        world.add(this.dialog);
    }

    public systemType = ex.SystemType.Update;

    public update(delta: number) {

        // const player = tiledMap.getEntitiesByName("player")[0] as ex.Actor;
        // if (!player) return;

        // Find the closest NPC in range
        // let closestNPC: ex.Entity | null = null;
        // let closestDistance = Infinity;

        // for (const entity of this.query.entities) {
        //     const npc = entity.get(Character);
        //     if (!npc) continue;

        //     const distance = player.pos.distance(entity.pos);
        //     if (distance < npc.interactionRadius && distance < closestDistance) {
        //         closestNPC = entity;
        //         closestDistance = distance;
        //     }
        // }

        // Handle interaction
        // if (closestNPC && game.input.keyboard.wasPressed(ex.Input.Keys.E)) {
        //     const npc = closestNPC.get(Character);
        //     if (npc) {
        //         const dialogText = npc.interact();
        //         if (dialogText) {
        //             this.dialog.show(`${npc.name}: ${dialogText}`);
        //         } else {
        //             this.dialog.hide();
        //         }
        //     }
        // } else if (!closestNPC && this.dialog.isVisible) {
        //     this.dialog.hide();
        // }

        // this.currentNPC = closestNPC;
    }
}