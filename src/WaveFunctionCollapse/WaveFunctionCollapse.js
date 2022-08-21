import RenderableCell from "./RenderableCell";

class WaveFunctionCollapse {
    cells = [];
    rows = [];
    columns;

    constructor (rows, columns, tiles) {
        this.rows = rows;
        this.columns = columns;
        const totalCells = rows * columns;
        for (let i = 0; i < totalCells; i++) {
            const allTiles = this.prepareTiles(tiles);
            this.cells.push(new RenderableCell(allTiles));
        }
    }

    prepareTiles(originalTiles) {
        let allTiles = [];
        for (let i in originalTiles) {
            const rotatedTiles = [];
            let uniqueTile = originalTiles[i];
            for (let j = 0; j < 4; j++) {
                rotatedTiles.push(uniqueTile);
                uniqueTile = this.clone(uniqueTile);
                uniqueTile.rotate90Degrees();
            }
            const distinctTiles = [];
            const distinctValues = [];
            for (let i = 0; i < rotatedTiles.length; i++) {
                const currentTile = rotatedTiles[i];
                const edges = currentTile.getTranslatedEdges();
                if (distinctValues.indexOf(edges)) {
                    distinctValues.push(edges);
                    distinctTiles.push(currentTile);
                }
            }
            allTiles = allTiles.concat(distinctTiles);
        }
        return allTiles;
    }

    collapse(){
        while(this.getUncollapsedCells(this.cells).length){
            this.iterate();
        }
    }

    clone(obj) {
        return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    }

    iterate() {
        const uncollapsedCells = this.getUncollapsedCells(this.cells);
        let cellsWithLowestEntropy;
        if (uncollapsedCells.length === this.cells.length) {
            cellsWithLowestEntropy = [this.getRandomFromArray(this.cells)];
        } else {
            const sortedCells = this.sortCellsByEntropyAsc(uncollapsedCells);
            cellsWithLowestEntropy = this.getCellsWithLowestEntropy(sortedCells);
        }
        this.propagateEntropyReduction(cellsWithLowestEntropy);
    }

    propagateEntropyReduction(cells) {
        this.collapseCells(cells);
        let cellsToPropagate = this.getCellsToPropagate();
        while (cellsToPropagate.length) {
            for (let cellIndex in cellsToPropagate) {
                let cellToPropagate = cellsToPropagate[cellIndex];
                const neighbouringCells = this.getNeighbouringCells(cellToPropagate);
                cellToPropagate.reduceEntropy(neighbouringCells);
            }
            cellsToPropagate = this.getCellsToPropagate();
        }

    }

    getCellsToPropagate() {
        return this.cells.filter(function (cell) {
            return cell.getPropagates() === true;
        });
    }

    collapseCells(cells) {
        for (let cellIndex in cells) {
            const cell = cells[cellIndex];
            const neighbouringCells = this.getNeighbouringCells(cell);
            cell.reduceEntropy(neighbouringCells);
            cell.collapse();
            for (let i = 0; i < neighbouringCells.length; i++) {
                const neighbouringCell = neighbouringCells[i];
                if (neighbouringCell && !neighbouringCell.getCollapsed()) {
                    neighbouringCell.setPropagates(true);
                }
            }
        }
    }

    getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getCellsWithLowestEntropy(cells) {
        const lowestPossibility = cells.reduce((lowestPossibility, currentCell) => {
            const currentPossibility = currentCell.getPossibleTiles().length;
            return lowestPossibility < currentPossibility ? lowestPossibility : currentPossibility;
        }, Infinity);
        return cells.filter((cell) => {
            return cell.getPossibleTiles().length === lowestPossibility;
        });
    }

    sortCellsByEntropyAsc(cells) {
        return cells.sort(function (a, b) {
            return a.getPossibleTiles().length < b.getPossibleTiles().length;
        });
    }

    getUncollapsedCells(cells) {
        return cells.filter((cell) => {
            return !cell.getCollapsed();
        });
    }

    getNeighbouringCells(cell) {
        const cellIndex = this.cells.indexOf(cell);
        return [
            cellIndex < this.columns ? null : this.cells[cellIndex - this.columns],
            (((cellIndex + 1) % this.columns) === 0) ? null : this.cells[cellIndex + 1],
            (cellIndex + 1) > (this.columns * (this.rows - 1)) ? null : this.cells[cellIndex + this.columns],
            ((cellIndex + 1) % this.columns) === 1 ? null : this.cells[cellIndex - 1]
        ];
    }

    getUntransformedCells(){
        return this.cells;
    }

    getCells() {
        const transformedCells = [];
        for (let i = 0; i < this.rows; i++) {
            transformedCells.push(this.cells.slice(i * this.columns, ((i + 1) * this.columns)));
        }
        return transformedCells;
    }
}

export default WaveFunctionCollapse;