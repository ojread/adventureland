import { Component } from "excalibur";

export class MoveCommand extends Component {
    public readonly type = "move_command";

    constructor(public target: ex.Vector, public speed: number = 100) {
        super();
    }
}

export class Movable extends Component {
    public readonly type = "movable";

    constructor(public speed: number = 100) {
        super();
    }
}