import { Gameboard } from "./gameboard";

class Player {
    constructor() {
        this.board = new Gameboard()
    }
}

export class Human extends Player {
    constructor(name = "Admiral") {
        super()
        this.name = name
    }
}

export class Computer extends Player {
    constructor() {
        super()
        this.name = "Enemy"
    }
}