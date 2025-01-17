import { Client, Room } from "colyseus.js";
import { Color, DisplayMode, Engine, Loader } from 'excalibur';

import { resources } from "./resources";
import { Level } from "./level";

// const game = new Engine({
//     width: 600,
//     height: 400,
//     backgroundColor: Color.fromHex("#472d3c"),
//     pixelArt: true,
//     pixelRatio: 2,
//     displayMode: DisplayMode.FitScreen,
//     scenes: { Level: Level }
// });

// const loader = new Loader(Object.values(resources));

// game.start(loader).then(() => {
//     game.goToScene("Level");
// });


class Game extends Engine {
    client?: Client;
    room?: Room;

    constructor() {
        super({
            width: 600,
            height: 400,
            backgroundColor: Color.fromHex("#472d3c"),
            pixelArt: true,
            pixelRatio: 2,
            displayMode: DisplayMode.FitScreen,
            scenes: { Level: Level }
        });
    }

    async connect() {

        try {
            this.client = new Client("ws://localhost:2567");
            this.room = await this.client.joinOrCreate("my_room");
        } catch (e) {
            console.error(e);
        }
    }
}

const game = new Game();
game.connect();
const loader = new Loader(Object.values(resources));

game.start(loader).then(() => {
    game.goToScene("Level");
});