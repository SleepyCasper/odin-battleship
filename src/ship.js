export class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false
    }

    hit() {
        if (this.hits === this.length) {
            throw new Error("This ship is already sunk")
        }
        return ++this.hits
    }

    isSunk() {
        if(this.length == this.hits) {
            this.sunk = true
        }

        return this.sunk
    }

    /* getHits() {
        return this.hits
    } */
}
