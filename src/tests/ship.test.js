import { Ship } from "../ship";

test("Is hit", () => {
	const ship = new Ship(4);
	ship.hit();
	expect(ship.hits).toBe(1);
});

test("Is sunk", () => {
	const ship = new Ship(4);
	for (let i = 0; i < 4; i++) {
		ship.hit();
	}

	expect(ship.isSunk()).toEqual(true);
});

test("Already sunk error", () => {
	const ship = new Ship(4);
	for (let i = 0; i < 4; i++) {
		ship.hit();
	}

	expect(() => ship.hit()).toThrow("This ship is already sunk");
});
