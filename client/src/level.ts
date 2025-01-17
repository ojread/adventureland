import { Client, Room } from "colyseus.js";
import { Engine, PointerEvent, Scene, SpriteSheet, TileMap } from "excalibur";

import { Player } from "./player";

// import { MyRoomState, PlayerState } from "../../server/src/rooms/schema/MyRoomState";

export class Level extends Scene {
    // client = new Client("ws://localhost:2567");
    client = new Client("wws://adventureland.onrender.com");
    room?: Room;
    playerEntities: { [index: string]: Player; } = {};

    override async onInitialize(engine: Engine) {
        console.log("Joining room...");

        try {
            this.room = await this.client.joinOrCreate("my_room");
            console.log("Joined successfully!");

            // Connect event handlers.
            // this.room.state.players.onAdd(this.handlePlayerJoined.bind(this));
            // this.room.state.players.onRemove(this.handlePlayerLeft.bind(this));
            // engine.input.pointers.primary.on("down", this.handleClick.bind(this));

            this.room.state.onStateChange((state: any) => {
                console.log("new state:", state);
            });
        } catch (e) {
            console.error(e);
        }


        // Listen for changes to the room state.



        // Create a sprite sheet
        // const spriteSheet = SpriteSheet.fromImageSource({
        //     image: resources.tilesheetTexture,
        //     grid: {
        //         rows: 22,
        //         columns: 49,
        //         spriteHeight: 16,
        //         spriteWidth: 16
        //     },
        //     spacing: {
        //         margin: {
        //             x: 1,
        //             y: 1
        //         }
        //     }
        // });

        // // Create a tilemap
        // const tilemap = new ex.TileMap({
        //     rows: 10,
        //     columns: 10,
        //     tileWidth: 16,
        //     tileHeight: 16,
        // });

        // // loop through tilemap cells
        // for (let tile of tilemap.tiles) {
        //     const sprite = spriteSheet.getSprite(0, 0);
        //     if (sprite) {
        //         tile.addGraphic(sprite);
        //     }
        // }

        // this.add(tilemap);
    }

    /*
    // Add new players to the scene.
    handlePlayerJoined(playerState: PlayerState, sessionId: string) {
        console.log("A player has joined! Their unique session id is", sessionId);

        // Create a new player entity and add it to the level.
        const newPlayer = new Player(playerState.x, playerState.y);
        this.add(newPlayer);

        // Also save a reference to the player entity by session ID.
        this.playerEntities[sessionId] = newPlayer;

        // Listen for changes to player state.
        playerState.onChange(() => {
            newPlayer.actions.clearActions();
            if (playerState.targetX && playerState.targetY) {
                newPlayer.actions.moveTo(playerState.targetX, playerState.targetY, 200);
            }
        });
    }

    // Remove disconnected players
    handlePlayerLeft(playerState: PlayerState, sessionId: string) {
        // Look up the player entity by session ID.
        const player = this.playerEntities[sessionId];
        if (player) {
            // Destroy the entity.
            player.kill();

            // Clear the local reference.
            delete this.playerEntities[sessionId];
        }
    }

    handleClick(event: PointerEvent) {
        // console.log(event);
        // this.player.moveTo(event.worldPos);
        // console.log(this.room);
        if (this && this.room) {
            this.room.send("moveTo", { x: event.worldPos.x, y: event.worldPos.y });
        }
    }
        */
}