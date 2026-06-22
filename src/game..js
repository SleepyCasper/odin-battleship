import { Human, Computer } from "./player";

export const Game = {
    player: null,

    startNewGame(name) {
        this.player = new Human(name)
    },
}