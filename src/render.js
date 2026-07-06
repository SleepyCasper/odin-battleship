import { Elements } from "./elements.js";

export const Render =(function() {
    let lastHoveredCells = []

    function renderSVGborder(ship) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
        svg.classList.add("border");
        svg.setAttribute('version', '1.1');
        svg.innerHTML = `
        <defs>
            <filter id="squiggly-0">
              <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="0"/>
              <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="6" />
            </filter>
            <filter id="squiggly-1">
              <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="1"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
            </filter>

            <filter id="squiggly-2">
              <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
            </filter>
            <filter id="squiggly-3">
              <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="3"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
            </filter>

            <filter id="squiggly-4">
              <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="4"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
            </filter>
          </defs>
        `

        ship.appendChild(svg);
    }

    function renderAxis(axis) {
      const span = document.querySelector("#btn-rotate span")

      switch (axis) {
        case "x": 
          span.textContent = "x"
          break;
        case "y":
          span.textContent = "y"
      }
    }

    function renderField(owner) {
      const axisX = document.createElement("div")
      axisX.classList.add("axis-x")
      axisX.innerHTML = `
        <div class="char">A</div>
        <div class="char">B</div>
        <div class="char">C</div>
        <div class="char">D</div>
        <div class="char">E</div>
        <div class="char">F</div>
        <div class="char">G</div>
        <div class="char">H</div>
        <div class="char">I</div>
        <div class="char">J</div>
      `
      const axisY = document.createElement("div")
      axisY.classList.add("axis-y")
      axisY.innerHTML = `
        <div class="num">1</div>
        <div class="num">2</div>
        <div class="num">3</div>
        <div class="num">4</div>
        <div class="num">5</div>
        <div class="num">6</div>
        <div class="num">7</div>
        <div class="num">8</div>
        <div class="num">9</div>
        <div class="num">10</div>
      `

      const field = document.createElement("div")

      for (let i = 0; i < 100; i++) {
        const cell = document.createElement("div");
        let row = Math.floor(i / 10)
        let col = i % 10
        cell.classList.add("cell")
        cell.dataset.row = row
        cell.dataset.col = col

        field.appendChild(cell)
      }

      console.log(Elements.gameArea.playerContField)

      if (owner === "player") {
        field.classList.add("field", "player")
        Elements.gameArea.playerContField.append(axisX, axisY, field)
      } else if (owner === "enemy") {
        field.classList.add("field", "enemy")
        Elements.gameArea.enemyContField.append(axisX, axisY, field)
      }
    }

    function hoverPreview(validStatus, cell) {
      switch (validStatus) {
        case true:
          cell.classList.add("preview-valid")
          break;
        case false:
          cell.classList.add("preview-invalid")
          break;
      }

      lastHoveredCells.push(cell)
    }

    function clearPreview() {
      lastHoveredCells.forEach(cell => cell.classList.remove("preview-valid", "preview-invalid"))
      lastHoveredCells = []
    }

    function disablePreview() {
      document.querySelectorAll(".field.player .cell").forEach(cell => {
        cell.classList.add("disabled")
      })
    }

    function enableBtnStart() {
      Elements.buttons.btnStartBattle.classList.remove("disabled")
    }

    function renderIMGShip(row, col, length, axis, id) {
      const div = document.createElement("div")
      div.classList.add("wrapper-ship")
      div.id = id

      const img = document.createElement("img")
      img.src = `./img/ship-${id}.png`
      img.alt = id

      if (axis === "y") {
        div.style.cssText = `
        grid-column-start: ${col + 1};
        grid-column-end: ${col + 2};
        grid-row-start: ${row + 1};
        grid-row-end: ${row + length + 1};
        max-width: 2rem;
        height: var(--${id}-width);
        `

        img.style.cssText = `
        width: calc(var(--${id}-width) * 0.9);
        transform: rotate(90deg);
        `
      } else {
          div.style.cssText = `
          grid-column-start: ${col + 1};
          grid-column-end: ${col + length + 1};
          grid-row-start: ${row + 1};
          grid-row-end: ${row + 2};
          width: var(--${id}-width);
          height: 2rem;
          `
        img.style.cssText = `width: calc(var(--${id}-width) * 0.9);`
      }

      // Placement in grid
      div.append(img)
      const playerField = document.querySelector(".player.field")
      playerField.appendChild(div)
    }

    function updateStatusBar(status, plName) {
      let text = ""
      
      switch(status) {
        case "start":
          text = "All ships are set, ready to start the battle."
          break;
        case "waiting":
          text = `Waiting for your orders, ${plName}!`
          break;
        case "invalid": 
          text = "This placement is invalid!"
          break;
        case "hitEnemy": 
          text = "The enemy hits your ship!"
          break;
        case "sinkEnemy":
          text = "The enemy sinks your ship!"
          break;
        case "hitPlayer":
          text = "You hit the enemy's ship!"
          break;
        case "sinkPlayer":
          text = "You sink the enemy's ship!"
          break;
      }

      Elements.statusBar.textContent = text
    }

    return {
        renderSVGborder,
        renderAxis,
        renderField,
        hoverPreview,
        clearPreview,
        disablePreview,
        enableBtnStart,
        renderIMGShip,
        updateStatusBar,
    }
})();