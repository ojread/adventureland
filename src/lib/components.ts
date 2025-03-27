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
