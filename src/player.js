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
        this.targetQueue = []      // array of { row, col, ship }
        this.activeHunts = new Map() // ship -> { hits: [[row,col], ...], axis: 'x'|'y'|null }
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

    attackHumanWaters(humanBoard) {
        // Step 2. Randomly hit when there's no target
        const randomHit = (humanBoard) => {
            const row = Math.floor(Math.random() * 10)
            const col = Math.floor(Math.random() * 10)

            handleHit(humanBoard, row, col)
        }
        // Step 2. Hit targeted ship
        const targetedHit = (humanBoard, target) => {
            handleHit(humanBoard, target.row, target.col)
        }

        // Step 3.1 Handle hit
        const handleHit = (humanBoard, row, col) => {
            try {
                const state = humanBoard.receiveAttack(row, col)
                console.log(state)

                // The cell we just attacked, if it came from the queue, is always
                // at the front (targetedHit only ever attacks targetQueue[0],
                // and randomHit only fires when the queue is empty).
                if (this.targetQueue.length !== 0) {
                    this.targetQueue.shift()
                }
                
                if (state === 'hit' || state === 'sunk') {
                    console.log("Getting neighbors")
                    // Identify which physical ship this cell belongs to.
                    // This is legitimate - we've already legally attacked this cell.
                    const ship = humanBoard.getCell(row, col).ship

                    let hunt = this.activeHunts.get(ship)
                    if (!hunt) {
                        hunt = { hits: [], axis: null }
                        this.activeHunts.set(ship, hunt)
                    }
                    hunt.hits.push([row, col])

                    if (state === 'sunk') {
                        // Only clear THIS ship's hunt and its queued candidates.
                        // Any other ship's in-progress hunt is untouched.
                        this.activeHunts.delete(ship)
                        this.targetQueue = this.targetQueue.filter(t => t.ship !== ship)
                    } else {
                        if (hunt.hits.length > 1) {
                            const [r1, c1] = hunt.hits[0]
                            const [r2, c2] = hunt.hits[hunt.hits.length - 1]

                            if (r1 === r2) hunt.axis = 'x'
                            else if (c1 === c2) hunt.axis = 'y'

                            // Prune stale, wrong-axis candidates belonging to THIS ship only
                            if (hunt.axis === 'x') {
                                this.targetQueue = this.targetQueue.filter(t => t.ship !== ship || t.row === r1)
                            } else if (hunt.axis === 'y') {
                                this.targetQueue = this.targetQueue.filter(t => t.ship !== ship || t.col === c1)
                            }

                            this._queueNeighbors(r1, c1, hunt.axis, ship)
                            this._queueNeighbors(r2, c2, hunt.axis, ship)
                        } else {
                            this._queueNeighbors(row, col, null, ship)
                        }
                    }
                    console.log("Updated queue:", this.targetQueue)
                }
            } catch (error) {
                if (error) {
                    if (error.message === "This cell is already hit" && this.targetQueue.length !== 0) {
                        this.targetQueue.shift()
                    }
                    this.attackHumanWaters(humanBoard)
                }
            }
        }
        
        // Step 1. Decide how to hit
        if (this.targetQueue.length !== 0) {
            // keep hunting target by hitting nearby cells
            targetedHit(humanBoard, this.targetQueue[0])
        } else randomHit(humanBoard)
    }

    // Step 3.2 Find next to hit cells
    // Computes valid neighbor coordinates and pushes them into targetQueue,
    // tagged with which ship they belong to.
    _queueNeighbors(row, col, axis, ship) {
        const neighbors = this._getNeighbors(row, col, axis)
        this.targetQueue.push(...neighbors.map(([r, c]) => ({ row: r, col: c, ship })))
    }

    _getNeighbors(row, col, axis) {
        let neighbors = []

        if (axis === null) {
            neighbors.push([row - 1, col])
            neighbors.push([row + 1, col])
            neighbors.push([row, col - 1])
            neighbors.push([row, col + 1])
        } else if (axis === 'x') {
            neighbors.push([row, col - 1])
            neighbors.push([row, col + 1])
        } else if (axis === 'y') {
            neighbors.push([row - 1, col])
            neighbors.push([row + 1, col])
        }
        
        // filter by bounds:
        let filtered = neighbors.filter(coord => coord[0] < 10 && coord[0] >= 0 && coord[1] < 10 && coord[1] >= 0)

        // filter by occupied and hit cells:
        let available = []
        
        filtered.forEach(coord => {
            const row = coord[0]
            const col = coord[1]
            const cell = this.board.getCell(row, col)
            console.log("Looking neighbors for cell:", cell)
            
            if (cell !== null) {
                if (cell.isHit === false) {
                    available.push(coord)
                } else if (cell === "miss") {
                    return
                }
            } else {
                available.push(coord)
            }
        })

        console.log("Filtered list of cells:", available)
        return available
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

const computer1 = new Computer()
const computer2 = new Computer()

computer1.placeShips()

computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)
computer2.attackHumanWaters(computer1.board)


printBoard(computer1.board.getBoard())