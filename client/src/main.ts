import { Color, DisplayMode, Engine, Loader } from 'excalibur';

import { resources } from "./resources";
import { Level } from "./level";

const game = new Engine({
    width: 600,
    height: 400,
    backgroundColor: Color.fromHex("#472d3c"),
    pixelArt: true,
    pixelRatio: 2,
    displayMode: DisplayMode.FitScreen,
    scenes: { Level: Level }
});

const loader = new Loader(Object.values(resources));

game.start(loader).then(() => {
    game.goToScene("Level");
});