import { Ship } from "./ship.js"

export class Gameboard {
    constructor() {
        this.board = this.createBoard()
        this.ships = []
        this.missedHits = []
    }

    createBoard() {
        /* let board = [] */

        // Using loop:
        /* for(let i = 0; i < 10; i++) {
            const arr = new Array(10).fill(null)
            board.push(arr);
        } */

        // Using from():
        let board = Array.from({ length: 10 }, () => new Array(10).fill(null))

        return board
    }

    placeShip(row, col, length, direction) {
        const newShip = new Ship(length)

        let count = 0;
        let current

        switch (direction) {
            case "x":
                current = col - 1
                while (count !== length) {
                    if (current > 9) {
                        throw new Error("Coordinates are out of bond")
                    }

                    if (this.board[row - 1][current] !== null) {
                        throw new Error ("This cell is already occupied")
                    }
                    this.board[row - 1][current] = { ship: newShip, isHit: false }
                    current += 1
                    count++
                } break;
            case "y":
                current = row - 1
                while (count !== length) {
                    if (current > 9) {
                        throw new Error("Coordinates are out of bond")
                    }

                    if (this.board[current][col - 1] !== null) {
                        throw new Error ("This cell is already occupied")
                    }
                    this.board[current][col - 1] = { ship: newShip, isHit: false }
                    current += 1
                    count++
                }
        }

        this.ships.push(newShip)
    }

    receiveAttack(row, col) {
        let cell = this.board[row - 1][col - 1]
        if (cell === null) {
            this.missedHits.push([row - 1, col - 1])
            this.board[row - 1][col - 1] = 'miss'
        } else if (typeof cell === "string" || cell.isHit === true) {
            throw new Error("This cell is already hit")
        } else {
            let ship = cell.ship
            ship.hit()
            cell.isHit = true
        }
        
    }

    isAllSunk() {
        return this.ships.every(ship => ship.isSunk())
    }

    getBoard() {
        return this.board
    }
}