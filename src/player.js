import { Gameboard } from "./gameboard.js";

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

    placeShips() {
        let ships = {
            carrier: 5,
            battleship: 4,
            destroyer: 3,
            submarine: 3,
            boat: 2
        }

        const recursion = (length) => {
            const row = Math.floor(Math.random() * 10)
            const col = Math.floor(Math.random() * 10)

            const axis = ["x", "y"]
            const index = Math.floor(Math.random() * 2)
            const dir = axis[index]

            try {
                this.board.placeShip(row, col, length, dir)
            } catch (error) {
                if (error) {
                    recursion(length)
                }
            }
        }

        Object.entries(ships).forEach(([key, value]) => {
            recursion(value)
        });
    }

    attackEnemyWaters() {
        
    }
}

function printBoard(board) {
  const header = "   " + Array.from({ length: 10 }, (_, i) => i).join("  ")
  console.log(header)

  board.forEach((row, rowIndex) => {
    const line = row.map(cell => cellToSymbol(cell)).join("  ")
    const rowLabel = String(rowIndex).padStart(2, " ")
    console.log(`${rowLabel} ${line}`)
  })
}

function cellToSymbol(cell) {
  if (cell === null) return "·"          // empty water
  if (typeof cell === "string" && cell === "miss") return "o"  // missed shot
  if (cell.isHit) return "X"             // ship, hit
  return "S"                              // ship, not hit
}

const computer = new Computer()
computer.placeShips()
printBoard(computer.board.getBoard())