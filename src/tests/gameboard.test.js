import { Gameboard } from "../gameboard";

test("Place ship horizontally", () => {
	const board = new Gameboard();
	board.placeShip(2, 3, 3, "x");
	expect(board.board[1][2]).toEqual({
		isHit: false,
		ship: { hits: 0, length: 3, sunk: false },
	});
	expect(board.board[1][3]).toEqual({
		isHit: false,
		ship: { hits: 0, length: 3, sunk: false },
	});
	expect(board.board[1][4]).toEqual({
		isHit: false,
		ship: { hits: 0, length: 3, sunk: false },
	});
});

test("Place ship vertically", () => {
	const board = new Gameboard();
	board.placeShip(2, 3, 2, "y");
	expect(board.board[1][2]).toEqual({
		isHit: false,
		ship: { hits: 0, length: 2, sunk: false },
	});
	expect(board.board[2][2]).toEqual({
		isHit: false,
		ship: { hits: 0, length: 2, sunk: false },
	});
});

test("A ship is out of bond", () => {
	const board = new Gameboard();
	expect(() => board.placeShip(1, 8, 4, "x")).toThrow(
		"Coordinates are out of bond",
	);
});

test("A cell is already occupied", () => {
	const board = new Gameboard();
	board.placeShip(2, 2, 2, "x");
	expect(() => board.placeShip(1, 2, 4, "y")).toThrow(
		"This cell is already occupied",
	);
});

test("Receive a missed attack", () => {
	const board = new Gameboard();
	board.placeShip(2, 2, 2, "x");
	board.receiveAttack(2, 4);
	expect(board.board[1][3]).toEqual("miss");
	expect(board.missedHits).toEqual([[1, 3]]);
});

test("Receive a hit attack", () => {
	const board = new Gameboard();
	board.placeShip(2, 2, 2, "x");
	board.receiveAttack(2, 2);
	expect(board.board[1][1]).toEqual({
		isHit: true,
		ship: { hits: 1, length: 2, sunk: false },
	});
});

test("A ship is hit and sunk", () => {
	const board = new Gameboard();
	board.placeShip(2, 6, 2, "y");
	board.receiveAttack(2, 6);
	board.receiveAttack(3, 6);
	expect(board.ships[0].hits).toBe(2);
	expect(board.ships[0].isSunk()).toEqual(true);
});

test("A ship cell is already hit", () => {
	const board = new Gameboard();
	board.placeShip(2, 2, 2, "x");
	board.receiveAttack(2, 2);
	expect(() => board.receiveAttack(2, 2)).toThrow("This cell is already hit");
});

test("An empty cell is already hit", () => {
	const board = new Gameboard();
	board.placeShip(2, 2, 2, "x");
	board.receiveAttack(1, 1);
	expect(() => board.receiveAttack(1, 1)).toThrow("This cell is already hit");
});

test("All ships are sunk", () => {
	const board = new Gameboard();
	board.placeShip(1, 1, 1, "x");
	board.placeShip(3, 1, 1, "x");
	board.placeShip(2, 7, 1, "x");
	board.placeShip(4, 9, 1, "x");
	board.ships.forEach((ship) => (ship.hits = ship.length));
	expect(board.isAllSunk()).toEqual(true);
});
