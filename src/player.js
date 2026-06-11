import { Gameboard } from "./gameboard";

class Player {
    constructor() {
        this.board = new Gameboard()
    }
}

class Human extends Player {
    constructor(name = "Captain") {
        super()
        this.name = name
    }
}

class Computer extends Player {
    constructor() {
        super()
        this.name = "Computer"
    }
}

const human = new Human()
const ai = new Computer()