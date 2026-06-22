import { Elements } from "./elements";

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

    return {
        renderSVGborder,
        renderAxis,
        renderField,
        hoverPreview,
        clearPreview,
    }
})();