import { Human, Computer } from "./player.js";
import { Render } from "./render.js";
import { findCell } from "./utils.js";

export let Game = {
    onAttack: null,

    startNewGame(name) {
        this.player = new Human(name);
        this.computer = new Computer();
        this.turn = "player";
    },

    handleAttack(attacker, row = null, col = null) {
        let attack
        let targetRow = row
        let targetCol = col

        if (attacker === 'player') {
            attack = this.computer.board.receiveAttack(row, col)
        } else if (attacker === 'computer') {
            const result = this.computer.attackHumanWaters(this.player.board);
            const targetCell = findCell(result)
            targetRow = result.row
            targetCol = result.col
            attack = result.state

            if (attack === "hit") {
                setTimeout(() => { Render.renderHit(targetCell)}, 1000)
                setTimeout(() => Render.updateStatusBar("hitEnemy", this.player.name), 1000)
                setTimeout(() => this.handleAttack("computer"), 2000)
            } else if (attack === "sunk") {
                const firstCell = this.player.board.getFirstShipCell(targetCell.dataset.row, targetCell.dataset.col)
                const cellNode = this.player.board.getCell(targetCell.dataset.row, targetCell.dataset.col)

                setTimeout(() => { Render.renderHit(targetCell)}, 1000)
                setTimeout(() => Render.updateStatusBar("sinkEnemy", this.player.name), 1000)
                setTimeout(() => {Render.renderSink(firstCell, cellNode.ship.length, cellNode.ship.axis, cellNode.ship.id, 'player')}, 1000)
                setTimeout(() => this.handleAttack("computer"), 2000)
            } else if (attack === "miss") {
                setTimeout(() => { Render.renderMiss(targetCell)}, 1000)
            } else if (attack === "allSunk") {
                const firstCell = this.player.board.getFirstShipCell(targetCell.dataset.row, targetCell.dataset.col)
                const cellNode = this.player.board.getCell(targetCell.dataset.row, targetCell.dataset.col)

                setTimeout(() => { Render.renderHit(targetCell)}, 1000)
                setTimeout(() => {Render.renderSink(firstCell, cellNode.ship.length, cellNode.ship.axis, cellNode.ship.id, 'player')}, 1000)
                setTimeout(() => {Render.renderWin("computer")}, 2000)
            }
        }

        if (attack === "miss") {
            this.makeTurn()
        }

        if (this.onAttack) {
            this.onAttack({ attacker, row: targetRow, col: targetCol, result: attack, turn: this.turn })
        }

        return attack
    },

    makeTurn() {
        if (this.turn === "player") {
            this.turn = "computer"
            Render.updateStatusBar("computer's turn", this.player.name)
            Render.disablePreview("computer")

            setTimeout(() => this.handleAttack("computer"), 1000)
        } else if (this.turn === "computer") {
            this.turn = "player"
            setTimeout(() => Render.updateStatusBar("waiting", this.player.name), 1500)
            setTimeout(() => Render.enablePreview("computer"), 1000)
        }
    },

    getTurn() {
        return this.turn
    }
}