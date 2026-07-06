import { Elements } from "./elements.js"
import { Render } from "./render.js";
import { Game } from "./game.js";

export const Events = () => {
    let vars = {
        placeDir: "x",
        activeShipLength: 5,
        activeShipName: "carrier",
        allPlaced: false,
        playerName: null,
        status: null
    }
    
    // UI:
    // New game 
    Elements.buttons.btnNewGame.addEventListener("click", () => {
        if (Elements.newGame.inputName.value) {
            Game.startNewGame(Elements.newGame.inputName.value)
        } else {Game.startNewGame()}
        
        vars.playerName = Game.player.name
        Elements.statusBar.querySelector("span").textContent = vars.playerName

        Elements.newGame.div.classList.add("hidden");
        Elements.gameArea.div.classList.remove("hidden");
        Elements.statusBar.classList.remove("hidden");

        Render.renderField("player")
    })

    // Handle status bar
    const handler = {
        set(target, prop, value) {
            target[prop] = value
            console.log(target)
            if (prop === "status") {
                Render.updateStatusBar(vars.status, vars.playerName)
            }
            return true
        }
    }

    vars = new Proxy(vars, handler)
    

    // Select ship to place
    Elements.gameArea.ships.forEach((ship) => {
        ship.addEventListener("click", (e) => {
            const currentShip = e.currentTarget.parentElement.querySelector(".choose")
            
            if (currentShip) {
              currentShip.classList.remove("choose");
              currentShip.lastElementChild.remove();
            }

            e.currentTarget.classList.add("choose");
            vars.activeShipName = e.currentTarget.id;
            Render.renderSVGborder(e.currentTarget);
            vars.activeShipLength = Number(e.currentTarget.dataset.length)
        })
    })

    // Change placement direction
    function handleDirection(event) {
        const targetButton = Elements.buttons.btnAxis;
        const isButtonHidden = targetButton && targetButton.offsetParent === null;

        if (event.type === 'keydown' && isButtonHidden) {
            return;
        }

        if (event.type === 'keydown' && event.key !== 'r') {
          return; 
        }
        
        vars.placeDir = (vars.placeDir === "x") ? "y" : "x";
        Render.renderAxis(vars.placeDir)
    }

    Elements.buttons.btnAxis.addEventListener("click", handleDirection)
    window.addEventListener("keydown", handleDirection)

    //Hover while placing ships
    Elements.gameArea.playerContField.addEventListener("mouseover", (e) => {
        let cell = e.target.closest(".cell")
        if (cell) {
            const row = Number(cell.dataset.row)
            const col = Number(cell.dataset.col)

            const hoveredCells = getCells(row, col)
            hoveredCells.forEach(cell => {
                const currentCell = findCell(cell)
                Render.hoverPreview(isValid(row, col), currentCell)
            }) 
        }
    })

    Elements.gameArea.playerContField.addEventListener("mouseout", (e) => {
        let cell = e.target.closest(".cell")
        if(cell) {
            Render.clearPreview()
        }
    })

    function isValid(row, col, length = vars.activeShipLength) {
        const cells = getCells(row, col)
        const cellNodes = cells.map(cell => findCell(cell))
        
        // Check if any cell is occupied
        if (cellNodes.some(cell => cell.classList.contains("occupied"))) {
            return false
        }

        if (vars.placeDir === "x") {
            if (col + length > 10) return false
        }

        if (vars.placeDir === "y") {
            if (row + length > 10) return false
        }

        return true
    }

    function getCells(row, col) {
        let cells = []
        let rowCoord = row
        let colCoord = col
        if (vars.placeDir === "x") {
            for (let i = 0; i < vars.activeShipLength; i++) {
                let cell = {row: row, col: colCoord}
                if (colCoord < 10) {
                    cells.push(cell)
                }
                colCoord++
            }
        }
        
        if (vars.placeDir === "y") {
            for (let i = 0; i < vars.activeShipLength; i++) {
                let cell = {row: rowCoord, col: col}
                
                if (rowCoord < 10) {
                    cells.push(cell)
                }
                rowCoord++
            }
        }

        return cells
    }

    function findCell(cell) {
        return Elements.gameArea.playerContField.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
    }

    // Place a ship
    Elements.gameArea.playerContField.addEventListener("click", (e) => {
        const cell = e.target.closest(".cell")

        if(cell) {
            const row = Number(cell.dataset.row)
            const col = Number(cell.dataset.col)
            
            if (isValid(row, col)) {
                vars.status = "waiting"
                //Set a ship to player's board
                Game.player.board.placeShip(row, col, vars.activeShipLength, vars.placeDir)
                console.log("A ship is placed at: (" + row + " , " + col + "). Current board: " + Game.player.board.getBoard())

                //Place img's of ship
                Render.renderIMGShip(row, col, vars.activeShipLength, vars.placeDir, vars.activeShipName)

                //Mark the cells as occupied
                const occupiedCells = getCells(row, col)
                occupiedCells.forEach(cell => {
                    const currentCell = findCell(cell)
                    currentCell.classList.add("occupied")
                })

                //Delete the ship img from placement window
                deleteChosenShip(vars.activeShipName)
            } else { 
                vars.status = "invalid"
            }
        }

        if (vars.allPlaced) {
            Render.disablePreview()
            Render.enableBtnStart()
            vars.status = "start"
        }
    })

    function deleteChosenShip(id) {
      const shipPreview = document.querySelector(`.ship.choose#${id}`)
      const shipsContainer = shipPreview.parentNode
      const nextPreview = shipPreview.nextElementSibling
      shipPreview.remove()
      const firstPreview = shipsContainer.firstElementChild
      
      console.log("shipPreview:", shipPreview)
      console.log("nextPreview:", nextPreview)
      console.log("firstPreview:", firstPreview)

      if(nextPreview) {
        nextPreview.click()
      } else if (nextPreview === null) {
        if (firstPreview === null) {
            vars.allPlaced = true
            return
        } else firstPreview.click()
      }
    }
     
    // Start the battle
    Elements.buttons.btnStartBattle.addEventListener("click", () => {
        Elements.gameArea.divPlaceShips.classList.add("hidden")
        vars.status = "waiting"

        // generate enemy field UI:
        Elements.gameArea.divPlaceShips.classList.add("hidden")
        Render.renderField("enemy")
        Elements.gameArea.enemyContField.classList.remove("hidden")

        // generate placement of enemy's ships

    })
}