import { Human, Computer } from "./player.js";

export const Game = {
    player: null,

    startNewGame(name) {
        this.player = new Human(name);
        this.computer = new Computer()
    },
}