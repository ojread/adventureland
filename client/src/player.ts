import { Actor, Color, Random, SpriteSheet, vec } from "excalibur";
import { resources } from "./resources";

export class Player extends Actor {
    constructor(x: number, y: number) {
        super({
            pos: vec(x, y),
            width: 16, // for now we'll use a box so we can see the rotation
            height: 16, // later we'll use a circle collider
            color: Color.Yellow
        });

        const spriteSheet = SpriteSheet.fromImageSource({
            image: resources.tilesheetImage,
            grid: {
                rows: 22,
                columns: 49,
                spriteWidth: 16,
                spriteHeight: 16,
            },
            spacing: {
                margin: {
                    x: 1,
                    y: 1
                }
            }
        });

        const rng = new Random();
        const spriteX = rng.integer(24, 31);
        const spriteY = rng.integer(0, 9);
        const sprite = spriteSheet.getSprite(spriteX, spriteY);

        const colours = [Color.fromHex("e6482e"), Color.fromHex("38d973"), Color.fromHex("3cacd7"), Color.fromHex("f4b41b")];
        sprite.tint = rng.pickOne(colours);

        this.graphics.add(sprite);
    }
}