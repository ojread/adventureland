import * as ex from "excalibur";

const game = new ex.Engine({
  width: 800,
  height: 600,
  backgroundColor: ex.Color.fromHex("#000000"),
  pixelArt: true,
  pixelRatio: 2,
  displayMode: ex.DisplayMode.FitScreen,
});

game.start();
