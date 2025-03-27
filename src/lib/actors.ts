import * as ex from "excalibur";

export class Dialog extends ex.ScreenElement {
    private title: ex.Label;
    private text: ex.Label;

    private isVisible: boolean = false;

    constructor() {
        super({
            x: 0,
            y: 160,
            width: 256,
            height: 96,
            z: 1000,
        });

        const background = new ex.Rectangle({
            width: this.width,
            height: this.height,
            color: ex.Color.Black,
            strokeColor: ex.Color.White,
            lineWidth: 2,
        });
        this.graphics.use(background);

        this.title = new ex.Label({
            text: 'Dialog title',
            pos: ex.vec(8, 8),
            font: new ex.Font({
                family: 'Arial',
                size: 8,
                bold: true,
                color: ex.Color.White,
            }),
            z: 1001,
        });
        this.addChild(this.title);

        this.text = new ex.Label({
            text: 'This is the dialog text.',
            pos: ex.vec(8, 24),
            font: new ex.Font({
                family: 'Sans-serif',
                size: 8,
                color: ex.Color.White,
            }),
            z: 1001,
        });
        this.addChild(this.text);


        for (let y = 8; y < 90; y += 22) {
            const button = new ex.ScreenElement({
                x: 130,
                y: y,
                width: 118,
                height: 16,
            });
            const buttonBackground = new ex.Rectangle({
                width: button.width,
                height: button.height,
                color: ex.Color.White,
            });
            const buttonLabel = new ex.Label({
                text: 'This is a button.',
                pos: ex.vec(4, 4),
                font: new ex.Font({
                    family: 'Arial',
                    size: 8,
                    color: ex.Color.Black,
                }),
                // z: 1001,
            });
            button.graphics.use(buttonBackground);
            button.addChild(buttonLabel);
            this.addChild(button);
            button.on("pointerup", () => {
                console.log("click");
            });
        }




        // this.graphics.visible = false;

        // this.on("pointerup", () => {
        //     // console.log("clicked dialog");
        //     this.hide();
        // });
    }

    // public onInitialize(engine: ex.Engine): void {
    //     this.on("pointerup", () => {
    //         console.log("clicked dialog");
    //     });
    // }

    public onAdd(engine: ex.Engine) {
        // this.pos.x = 0;
        // this.pos.y = engine.halfDrawHeight;
        // this.height = engine.halfDrawHeight;

    }

    show(text: string) {
        this.text.text = text;
        this.graphics.visible = true;
        this.isVisible = true;
    }

    hide() {
        this.graphics.visible = false;
        this.isVisible = false;
    }
}
