import { Elements } from "./elements"
import { Render } from "./render";
import { Game } from "./game.";

export const Events = () => {
    let placeDir = "x"
    let activeShipLength = 5
    let playerName = ""
    

    // UI:
    // New game 
    Elements.buttons.btnNewGame.addEventListener("click", () => {
        if (Elements.newGame.inputName.value) {
            Game.startNewGame(Elements.newGame.inputName.value)
        } else {Game.startNewGame()}
        
        playerName = Game.player.name
        Elements.statusBar.querySelector("span").textContent = playerName

        Elements.newGame.div.classList.add("hidden");
        Elements.gameArea.div.classList.remove("hidden");
        Elements.statusBar.classList.remove("hidden");

        Render.renderField("player")
    })

    // Select ship to place
    Elements.gameArea.ships.forEach((ship) => {
        ship.addEventListener("click", (e) => {
            const currentShip = e.currentTarget.parentElement.querySelector(".choose")

            if (currentShip) {
              currentShip.classList.remove("choose");
              currentShip.lastElementChild.remove();
            }
            e.currentTarget.classList.add("choose")
            Render.renderSVGborder(e.currentTarget);
            activeShipLength = Number(e.currentTarget.dataset.length)
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
        
        placeDir = (placeDir === "x") ? "y" : "x";
        Render.renderAxis(placeDir)
    }

    Elements.buttons.btnAxis.addEventListener("click", handleDirection)
    window.addEventListener("keydown", handleDirection)

    //Hover while placing ships
    function isValid(row, col, length = activeShipLength) {
        if (placeDir === "x") {
            if (col + length > 10) return false
        }

        if (placeDir === "y") {
            if (row + length > 10) return false
        }

        return true
    }

    function getCells(row, col) {
        let cells = []
        let rowCoord = row
        let colCoord = col
        if (placeDir === "x") {
            for (let i = 0; i < activeShipLength; i++) {
                let cell = {row: row, col: colCoord}
                if (colCoord < 10) {
                    cells.push(cell)
                }
                colCoord++
            }
        }
        
        if (placeDir === "y") {
            for (let i = 0; i < activeShipLength; i++) {
                let cell = {row: rowCoord, col: col}
                
                if (rowCoord < 10) {
                    cells.push(cell)
                }
                rowCoord++
            }
        }

        return cells
    }

    Elements.gameArea.playerContField.addEventListener("mouseover", (e) => {
        let cell = e.target.closest(".cell")
        if (cell) {
            const row = Number(cell.dataset.row)
            const col = Number(cell.dataset.col)
            
            const hoveredCells = getCells(row, col)
            hoveredCells.forEach(cell => {
                const currentCell = Elements.gameArea.playerContField.querySelector(`[data-row="${cell.row}"][data-col="${cell.col}"]`);
                console.log(currentCell)
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

    // Start the battle
    Elements.buttons.btnStartBattle.addEventListener("click", () => {
        //! check if all the ships has been placed: 

        Elements.gameArea.divPlaceShips.classList.add("hidden")
        //generate enemy field:
        Elements.gameArea.divPlaceShips.classList.add("hidden")
        Render.renderField("enemy")
        Elements.gameArea.enemyContField.classList.remove("hidden")
    })
}