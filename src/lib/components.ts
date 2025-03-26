import * as ex from "excalibur";

export class MoveCommand extends ex.Component {
    public readonly type = "move_command";

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

export class Character extends ex.Component {
    public readonly type = "character";

    public name: string;
    public dialog: string[];
    public currentDialogIndex: number = 0;
    public interactionRadius: number = 32;

    constructor(config: {
        name: string;
        dialog: string[];
        interactionRadius?: number;
    }) {
        super();
        this.name = config.name;
        this.dialog = config.dialog;
        this.interactionRadius = config.interactionRadius ?? 32;
    }

    onAdd() {
        // Actors can detect clicks like this.
        // Tough to feed back to the main program though...
        this.owner?.on("pointerup", () => {
            console.log("Character");
        });
    }

    interact(): string | null {
        if (this.currentDialogIndex >= this.dialog.length) {
            this.currentDialogIndex = 0; // Reset dialog
            return null;
        }
        const currentDialog = this.dialog[this.currentDialogIndex];
        this.currentDialogIndex++;
        return currentDialog;
    }
}

export class Dialog extends ex.ScreenElement {
    private text: ex.Label;
    // private isVisible: boolean = false;

    constructor() {
        super({
            width: 50,
            height: 50,
        });

        this.text = new ex.Label({
            text: 'This is the dialog.',
            pos: ex.vec(10, 20),
            font: new ex.Font({
                family: 'Arial',
                size: 10,
                color: ex.Color.White,
            }),
        });
        this.addChild(this.text);

        const background = new ex.Rectangle({
            width: this.width,
            height: this.height,
            color: ex.Color.Black,
            strokeColor: ex.Color.White,
            lineWidth: 2,
        });
        this.graphics.use(background);

        this.graphics.visible = false;
    }

    public onAdd(engine: ex.Engine) {
        this.pos.x = engine.halfDrawWidth;
        this.pos.y = engine.drawHeight - 30;
    }

    show(text: string) {
        this.text.text = text;
        this.graphics.visible = true;
        // this.isVisible = true;
    }

    hide() {
        this.graphics.visible = false;
        // this.isVisible = false;
    }
}
