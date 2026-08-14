import { Elements } from "./elements.js";
import { Render } from "./render.js";
import { Game } from "./game.js";
import { Storage } from "./storage.js";
import { printBoard } from "./player.js";
import { findCell } from "./utils.js";

export const Events = () => {
	let vars = {
		placeDir: "x",
		activeShipLength: 5,
		activeShipName: "carrier",
		allPlaced: false,
		playerName: null,
		status: null,
		storage: null,
	};

	// Handle status bar
	const handler = {
		set(target, prop, value) {
			target[prop] = value;
			if (prop === "status") {
				Render.updateStatusBar(vars.status, vars.playerName);
			}
			return true;
		},
	};

	vars = new Proxy(vars, handler);

	Game.onAttack = ({ attacker, row, col, result, turn }) => {
		Storage.captureAttack(attacker, row, col);
		Storage.captureTurn(turn);

		if (attacker === "computer") {
			Storage.captureComputerState(
				Game.computer.targetQueue,
				Game.computer.activeHunts,
			);
		}
	};

	const STAGE = sessionStorage.getItem("stage");

	function handleReload() {
		if (STAGE === "newGame") {
			Storage.clearAll();
		}
		if (STAGE === "placement" || STAGE === "allPlaced") {
			initialRestore();

			// Render ships to place
			Render.renderShipsToPlace();

			//Get and replace placed ships
			const ships = Storage.restorePlacement();
			if (ships.length > 0) {
				ships.forEach((ship) => {
					Game.player.board.placeShip(
						ship.row,
						ship.col,
						ship.length,
						ship.dir,
						ship.id,
					);
					Render.renderIMGShip(ship.row, ship.col, ship.length, ship.dir, ship.id);
					const shipDOM = document.querySelector(`#ships #${ship.id}`);
					shipDOM.remove();
					occupyCells(ship.row, ship.col, ship.length, ship.dir);
				});

				const shipsContainer = document.querySelector(".ships#ships");
				const firstShip = shipsContainer.firstElementChild;
				if (firstShip) {
					firstShip.classList.add("choose");
					Render.renderSVGborder(firstShip);

					//Update vars
					vars.activeShipName = firstShip.id;
					vars.activeShipLength = Number(firstShip.dataset.length);
				}
			}

			if (STAGE === "allPlaced") {
				Render.enableBtnStart();
				Render.updateStatusBar("start");
			}
		}

		if (STAGE === "game") {
			initialRestore();

			Elements.gameArea.enemyContField.classList.remove("hidden");
			document.querySelector(".field.player").classList.add("disabled");
			Elements.gameArea.divPlaceShips.classList.add("hidden");
			Elements.btnRestart.classList.remove("hidden");

			Render.renderField("computer");

			restorePlayerShips();

			//restore computer's ships
			const compShips = Storage.restoreCompShips();
			compShips.forEach((ship) => {
				Game.computer.board.placeShip(
					ship.row,
					ship.col,
					ship.length,
					ship.axis,
					ship.id,
				);
			});

			restoreAttacks();
		}
	}

	function initialRestore() {
		vars.playerName = Storage.restoreName();
		vars.status = "waiting";

		Game.startNewGame(vars.playerName);

		// Recreate UI
		Elements.newGame.div.classList.add("hidden");
		Elements.gameArea.div.classList.remove("hidden");
		Elements.statusBar.classList.remove("hidden");

		Render.renderField("player");
	}

	function restorePlayerShips() {
		const ships = Storage.restorePlacement();

		if (ships.length > 0) {
			ships.forEach((ship) => {
				Game.player.board.placeShip(
					ship.row,
					ship.col,
					ship.length,
					ship.dir,
					ship.id,
				);
				Render.renderIMGShip(ship.row, ship.col, ship.length, ship.dir, ship.id);
				occupyCells(ship.row, ship.col, ship.length, ship.dir);
			});
		}
	}

	function restoreAttacks() {
		const attacks = Storage.restoreAttacks();
		let winner = null;

		// Rebuild the computer's hunting state
		const computerState = Storage.restoreComputerState();
		Game.computer.restoreState(computerState, Game.player.board);

		attacks.forEach(({ attacker, row, col }) => {
			if (attacker === "player") {
				const result = Game.computer.board.receiveAttack(row, col);
				const cell = findCell({ row, col }, "computer");
				applyAttackRender(cell, result, "computer", row, col);
				if (result === "allSunk") winner = "player";
			} else if (attacker === "computer") {
				const result = Game.player.board.receiveAttack(row, col);
				const cell = findCell({ row, col }, "player");
				applyAttackRender(cell, result, "player", row, col);
				if (result === "allSunk") winner = "computer";
			}
		});

		const turn = Storage.restoreTurn();
		if (turn) Game.turn = turn;

		if (winner) {
			Render.renderWin(winner);
			document.querySelector(".field.computer").classList.add("disabled");
		} else if (Game.turn === "computer") {
			vars.status = "computer's turn";
			Render.disablePreview("computer");
		} else {
			vars.status = "waiting";
			Render.enablePreview("computer");
		}
	}

	function applyAttackRender(cell, result, field, row, col) {
		if (result === "miss") {
			Render.renderMiss(cell);
			return;
		}

		Render.renderHit(cell);

		if (result === "sunk" || result === "allSunk") {
			const board = field === "computer" ? Game.computer.board : Game.player.board;
			const firstCell = board.getFirstShipCell(row, col);
			const cellNode = board.getCell(row, col);
			Render.renderSink(
				firstCell,
				cellNode.ship.length,
				cellNode.ship.axis,
				cellNode.ship.id,
				field,
			);
		}
	}

	function occupyCells(row, col, length, dir) {
		for (let i = 0; i < length; i++) {
			const r = dir === "y" ? row + i : row;
			const c = dir === "x" ? col + i : col;
			const cell = Elements.gameArea.playerContField.querySelector(
				`[data-row="${r}"][data-col="${c}"]`,
			);
			if (cell) cell.classList.add("occupied");
		}
	}

	handleReload();

	function getShipCells(row, col, length, dir) {
		let cells = [];

		if (dir === "x") {
			for (let c = col; c < col + length; c++) {
				cells.push({ row: row, col: c });
			}
		}

		if (dir === "y") {
			for (let r = row; r < row + length; r++) {
				cells.push({ row: r, col: col });
			}
		}

		return cells;
	}

	// UI:
	// New game
	Elements.buttons.btnNewGame.addEventListener("click", () => {
		// Create new Game class
		if (Elements.newGame.inputName.value) {
			Game.startNewGame(Elements.newGame.inputName.value);
		} else {
			Game.startNewGame();
		}

		vars.playerName = Game.player.name;
		vars.status = "waiting";
		Storage.setStage("placement");
		Storage.captureName(vars.playerName);

		Elements.newGame.div.classList.add("hidden");
		Elements.gameArea.div.classList.remove("hidden");
		Elements.statusBar.classList.remove("hidden");

		// Render field and ships to place
		Render.renderField("player");
		Render.renderShipsToPlace();
	});

	// Select ship to place
	Elements.gameArea.divPlaceShips.addEventListener("click", (e) => {
		const ship = e.target.closest("#ships .ship");

		if (ship) {
			const currentShip = e.currentTarget.parentElement.querySelector(".choose");
			if (currentShip) {
				currentShip.classList.remove("choose");
				currentShip.lastElementChild.remove();
			}

			ship.classList.add("choose");
			vars.activeShipName = ship.id;
			Render.renderSVGborder(ship);
			vars.activeShipLength = Number(ship.dataset.length);
		}
	});

	// Change placement direction
	function handleDirection(event) {
		const targetButton = Elements.buttons.btnAxis;
		const isButtonHidden = targetButton && targetButton.offsetParent === null;

		if (event.type === "keydown" && isButtonHidden) {
			return;
		}

		if (event.type === "keydown" && event.key !== "r") {
			return;
		}

		vars.placeDir = vars.placeDir === "x" ? "y" : "x";
		Render.renderAxis(vars.placeDir);
	}

	Elements.buttons.btnAxis.addEventListener("click", handleDirection);
	window.addEventListener("keydown", handleDirection);

	//Hover while placing ships
	Elements.gameArea.playerContField.addEventListener("mouseover", (e) => {
		let cell = e.target.closest(".cell");
		if (cell) {
			const row = Number(cell.dataset.row);
			const col = Number(cell.dataset.col);

			const hoveredCells = getCells(row, col, vars);
			hoveredCells.forEach((cell) => {
				const currentCell = findCell(cell);
				Render.hoverPreview(isValid(row, col), currentCell);
			});
		}
	});

	Elements.gameArea.playerContField.addEventListener("mouseout", (e) => {
		let cell = e.target.closest(".cell");
		if (cell) {
			Render.clearPreview();
		}
	});

	function isValid(row, col, length = vars.activeShipLength) {
		const cells = getCells(row, col, vars);
		const cellNodes = cells.map((cell) => findCell(cell));

		// Check if any cell is occupied
		if (cellNodes.some((cell) => cell.classList.contains("occupied"))) {
			return false;
		}

		if (vars.placeDir === "x") {
			if (col + length > 10) return false;
		}

		if (vars.placeDir === "y") {
			if (row + length > 10) return false;
		}

		return true;
	}

	// Place a ship
	Elements.gameArea.playerContField.addEventListener("click", (e) => {
		const cell = e.target.closest(".cell");

		if (cell) {
			const row = Number(cell.dataset.row);
			const col = Number(cell.dataset.col);

			if (isValid(row, col)) {
				vars.status = "waiting";
				//Set a ship to player's board
				Game.player.board.placeShip(
					row,
					col,
					vars.activeShipLength,
					vars.placeDir,
					vars.activeShipName,
				);
				const data = {
					row: row,
					col: col,
					length: vars.activeShipLength,
					dir: vars.placeDir,
					id: vars.activeShipName,
				};
				Storage.capturePlacement(vars.activeShipName, data);

				//Place img's of ship
				Render.renderIMGShip(
					row,
					col,
					vars.activeShipLength,
					vars.placeDir,
					vars.activeShipName,
				);

				//Mark the cells as occupied
				const occupiedCells = getCells(row, col, vars);
				occupiedCells.forEach((cell) => {
					const currentCell = findCell(cell);
					currentCell.classList.add("occupied");
				});

				//Delete the ship img from placement window
				deleteChosenShip(vars.activeShipName);
			} else {
				vars.status = "invalid";
			}
		}

		if (vars.allPlaced) {
			Render.disablePreview("player");
			Render.enableBtnStart();
			vars.status = "start";
			Storage.setStage("allPlaced");
		}
	});

	function deleteChosenShip(id) {
		const shipPreview = document.querySelector(`.ship.choose#${id}`);
		const shipsContainer = shipPreview.parentNode;
		const nextPreview = shipPreview.nextElementSibling;
		shipPreview.remove();
		const firstPreview = shipsContainer.firstElementChild;

		if (nextPreview) {
			nextPreview.click();
		} else if (nextPreview === null) {
			if (firstPreview === null) {
				vars.allPlaced = true;
				return;
			} else firstPreview.click();
		}
	}

	// Start the battle
	Elements.buttons.btnStartBattle.addEventListener("click", () => {
		Elements.gameArea.divPlaceShips.classList.add("hidden");
		vars.status = "waiting";

		// clean up after placement
		const divPlaceShips = document.querySelector("#ships.ships");
		divPlaceShips.remove();

		// generate enemy field UI:
		Elements.gameArea.divPlaceShips.classList.add("hidden");
		Render.renderField("computer");
		Elements.gameArea.enemyContField.classList.remove("hidden");
		Elements.btnRestart.classList.remove("hidden");

		// generate placement of enemy's ships
		Game.computer.placeShips();

		// Store enemy's placement
		const compShips = Game.computer.board.getShips();
		Storage.captureCompPlacement(compShips);
		Storage.setStage("game");
		Storage.captureTurn(Game.turn);
	});

	// Handle turns
	Elements.gameArea.enemyContField.addEventListener("click", (e) => {
		// When player attacks
		const cell = e.target.closest(".cell");
		if (cell) {
			const attack = Game.handleAttack(
				"player",
				cell.dataset.row,
				cell.dataset.col,
			);
			printBoard(Game.computer.board.getBoard());

			if (attack === "hit") {
				vars.status = "hitPlayer";
				// render hit:
				Render.renderHit(cell);
			} else if (attack === "miss") {
				// render miss:
				Render.renderMiss(cell);
			} else if (attack === "sunk" || attack === "allSunk") {
				vars.status = "sinkPlayer";
				Render.renderHit(cell);
				// render sinking:
				const firstCell = Game.computer.board.getFirstShipCell(
					cell.dataset.row,
					cell.dataset.col,
				);
				const cellNode = Game.computer.board.getCell(
					cell.dataset.row,
					cell.dataset.col,
				);
				Render.renderSink(
					firstCell,
					cellNode.ship.length,
					cellNode.ship.axis,
					cellNode.ship.id,
					"computer",
				);

				// player wins the game
				if (attack === "allSunk") {
					setTimeout(() => Render.renderWin("player"), 2000);
				}
			}
		}
	});

	// Start new game after finish
	Elements.gameArea.div.addEventListener("click", (e) => {
		const btnNewGame = e.target.closest("#win-notif .btn-again");

		if (btnNewGame) {
			// reset the game
			Storage.clearAll();
			Storage.setStage("newGame");
			resetGame();

			const dialog = e.target.closest("#win-notif");
			dialog.close();
		}
	});

	// Restart the game
	Elements.btnRestart.addEventListener("click", () => {
		Storage.clearAll();
		Storage.setStage("newGame");
		resetGame();
	});

	function resetGame() {
		vars.placeDir = "x";
		vars.activeShipLength = 5;
		vars.activeShipName = "carrier";
		vars.allPlaced = false;
		vars.playerName = null;
		vars.status = null;

		Render.rerenderNewGame();
	}
};

export function getCells(row, col, vars) {
	let cells = [];
	let rowCoord = row;
	let colCoord = col;
	if (vars.placeDir === "x") {
		for (let i = 0; i < vars.activeShipLength; i++) {
			let cell = { row: row, col: colCoord };
			if (colCoord < 10) {
				cells.push(cell);
			}
			colCoord++;
		}
	}

	if (vars.placeDir === "y") {
		for (let i = 0; i < vars.activeShipLength; i++) {
			let cell = { row: rowCoord, col: col };

			if (rowCoord < 10) {
				cells.push(cell);
			}
			rowCoord++;
		}
	}

	return cells;
}
