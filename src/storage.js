export const Storage = (function () {
	function setStage(stage) {
		sessionStorage.setItem("stage", stage);
	}

	function captureName(playerName) {
		sessionStorage.setItem("vars: playerName", playerName);
	}

	function capturePlacement(key, data) {
		sessionStorage.setItem(`placedShip: ${key}`, JSON.stringify(data));
	}

	function captureCompPlacement(ships) {
		sessionStorage.setItem("compShips:", JSON.stringify(ships));
	}

	function captureComputerState(targetQueue, activeHunts) {
		const serializedQueue = targetQueue.map(({ row, col, ship }) => ({
			row,
			col,
			shipId: ship ? ship.id : null,
		}));

		const serializedHunts = Array.from(activeHunts.entries()).map(
			([ship, hunt]) => ({
				shipId: ship.id,
				hits: hunt.hits,
				axis: hunt.axis,
			}),
		);

		sessionStorage.setItem(
			"computerState",
			JSON.stringify({
				targetQueue: serializedQueue,
				activeHunts: serializedHunts,
			}),
		);
	}

	function captureTurn(turn) {
		sessionStorage.setItem("vars: turn", turn);
	}

	function restoreTurn() {
		return sessionStorage.getItem("vars: turn");
	}

	function captureAttack(attacker, row, col) {
		const attacks = JSON.parse(sessionStorage.getItem("attacks") || "[]");
		attacks.push({ attacker, row: Number(row), col: Number(col) });
		sessionStorage.setItem("attacks", JSON.stringify(attacks));
	}

	function restoreAttacks() {
		return JSON.parse(sessionStorage.getItem("attacks") || "[]");
	}

	function restoreName() {
		return sessionStorage.getItem("vars: playerName");
	}

	function restoreCompShips() {
		return JSON.parse(sessionStorage.getItem("compShips:"));
	}

	function restoreDir() {
		return sessionStorage.getItem("vars: dir");
	}

	function restorePlacement() {
		let ships = [];
		Object.keys(sessionStorage)
			.filter((key) => key.startsWith("placedShip:"))
			.forEach((key) => {
				const ship = JSON.parse(sessionStorage.getItem(key));
				ships.push(ship);
			});

		return ships;
	}

	function restoreComputerState() {
		const raw = sessionStorage.getItem("computerState");
		return raw ? JSON.parse(raw) : { targetQueue: [], activeHunts: [] };
	}

	function clearAll() {
		sessionStorage.clear();
	}

	return {
		setStage,
		captureName,
		capturePlacement,
		captureCompPlacement,
		captureComputerState,
		captureAttack,
		captureTurn,
		restoreAttacks,
		restoreTurn,
		restoreName,
		restoreDir,
		restorePlacement,
		restoreCompShips,
		restoreComputerState,
		clearAll,
	};
})();
