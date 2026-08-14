export class Ship {
	constructor(row, col, length, direction, id) {
		this.row = row;
		this.col = col;
		this.length = length;
		this.axis = direction;
		this.id = id;
		this.hits = 0;
		this.sunk = false;
	}

	hit() {
		if (this.hits === this.length) {
			throw new Error("This ship is already sunk");
		}
		return ++this.hits;
	}

	isSunk() {
		if (this.length == this.hits) {
			this.sunk = true;
		}

		return this.sunk;
	}

	/* getHits() {
        return this.hits
    } */
}
