import { Elements } from "./elements.js";

export function findCell(cell, owner = "player") {
	if (owner === "player") {
		return Elements.gameArea.playerContField.querySelector(
			`[data-row="${cell.row}"][data-col="${cell.col}"]`,
		);
	} else {
		return Elements.gameArea.enemyContField.querySelector(
			`[data-row="${cell.row}"][data-col="${cell.col}"]`,
		);
	}
}
