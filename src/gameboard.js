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
       let valids = []

       switch (direction) {
           case "x":
               for (let current = col; valids.length < length; current++) {
                   if (current > 9) {
                       throw new Error("Coordinates are out of bond")
                   }
                   if (this.board[row][current] !== null) {
                       throw new Error("This cell is already occupied")
                   }
                   valids.push([row, current])
               }
               break;

           case "y":
               for (let current = row; valids.length < length; current++) {
                   if (current > 9) {
                       throw new Error("Coordinates are out of bond")
                   }
                   if (this.board[current][col] !== null) {
                       throw new Error("This cell is already occupied")
                   }
                   valids.push([current, col])
               }
               break;
       }

       valids.forEach(coord => {
           this.board[coord[0]][coord[1]] = { ship: newShip, isHit: false }
       })

       this.ships.push(newShip)
    }

    receiveAttack(row, col) {
        console.log(`Attacking (${row}, ${col})!`)
        let cell = this.board[row][col]
        if (cell === null) {
            this.missedHits.push([row, col])
            this.board[row][col] = 'miss'
            return 'miss'
        } else if (typeof cell === "string" || cell.isHit === true) {
            throw new Error("This cell is already hit")
        } else {
            let ship = cell.ship
            
            ship.hit()
            cell.isHit = true

            let isSunk = ship.isSunk()

            if (isSunk == true) {
                return 'sunk'
            } else return 'hit'
        }
        
    }

    isAllSunk() {
        return this.ships.every(ship => ship.isSunk())
    }

    getBoard() {
        return this.board
    }

    getCell(row, col) {
        return this.board[row][col]
    }
}