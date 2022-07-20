import p5 from 'p5';

const GRID_ROWS = 10;
const GRID_COLUMNS = 10;

class Tile {
    edges = [];
    figures = [];

    getFigures() {
        return this.figures;
    }

    getEdges() {
        return this.edges;
    }
}

class HorizontalTile extends Tile {
    edges = [
        0, 1, 0, 1
    ]
    figures = [
        [
            0, 0.5,
            1, 0.5
        ]
    ]
}

class VerticalTile extends Tile {
    edges = [
        1, 0, 1, 0
    ]
    figures = [
        [
            0.5, 0,
            0.5, 1
        ]
    ]
}

class Corner0Tile extends Tile {
    edges = [
        1, 1, 0, 0
    ]
    figures = [
        [
            0.5, 0.0,
            0.5, 0.5,
            1, 0.5
        ],
    ]
}

class Corner90Tile extends Tile {
    edges = [
        0, 1, 1, 0
    ]
    figures = [
        [
            1, 0.5,
            0.5, 0.5,
            0.5, 1
        ],
    ]
}

class Corner180Tile extends Tile {
    edges = [
        0, 0, 1, 1
    ]
    figures = [
        [
            0.5, 1,
            0.5, 0.5,
            0.0, 0.5
        ],
    ]
}

class Corner270Tile extends Tile {
    edges = [
        1, 0, 0, 1
    ]
    figures = [
        [
            0.0, 0.5,
            0.5, 0.5,
            0.5, 0.0
        ],
    ]
}

class CrossTile extends Tile {
    edges = [
        1, 1, 1, 1
    ]
    figures = [
        [
            0.0, 0.5,
            1, 0.5,
        ],
        [
            0.5, 0.0,
            0.5, 1.0,
        ],
    ]
}

class Cell {
    collapsed = false;
    collapsedTile;
    possibleTiles = [];

    constructor(allTiles) {
        this.possibleTiles = allTiles;
    }

    getPossibleTiles() {
        return this.possibleTiles;
    }

    getCollapsed() {
        return this.collapsed;
    }

    getTile() {
        return this.collapsedTile;
    }

    collapse(neigbouringCells) {
        for (let i = 0; i < neigbouringCells.length; i++) {
            const neighbouringCell = neigbouringCells[i];
            if (neighbouringCell === null) {
                continue;
            }
            if (neighbouringCell.getCollapsed()) {
                const neighbouringEdge = neighbouringCell.getTile().getEdges()[(i + 2) % 4]
                this.possibleTiles = this.possibleTiles.filter(function(possibleTile){
                    return possibleTile.getEdges()[i] === neighbouringEdge
                })
            }
        }
        this.collapsed = true;
        this.collapsedTile = this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)]
    }
}

class WaveFunctionCollapse {
    cells = [];
    rows = [];
    columns;

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        const totalCells = rows * columns;
        for (let i = 0; i < totalCells; i++) {
            this.cells.push(new Cell([
                new HorizontalTile(),
                new VerticalTile(),
                new Corner0Tile(),
                new Corner90Tile(),
                new Corner180Tile(),
                new Corner270Tile(),
                new CrossTile(),
            ]));
        }
    }

    collapse() {

    }

    collapseSingle() {
        const uncollapsedCells = this.cells.filter((cell) => {
            return !cell.getCollapsed()
        });
        if (!uncollapsedCells.length) {
            throw new Error('@todo no uncollapsedCells');
        }
        const lowestPossibility = uncollapsedCells.reduce((lowestPossibility, currentCell) => {
            const currentPossibility = currentCell.getPossibleTiles().length;
            return lowestPossibility < currentPossibility ? lowestPossibility : currentPossibility;
        }, Infinity)
        if (lowestPossibility === 0) {
            throw new Error('@todo no cells with any possible tiles');
        }
        const cellsWithLowestIndex = uncollapsedCells.filter((cell) => {
            return cell.getPossibleTiles().length === lowestPossibility;
        })
        const randomCell = cellsWithLowestIndex[Math.floor(Math.random() * cellsWithLowestIndex.length)];
        const randomCellIndex = this.cells.indexOf(randomCell);
        const neighbouringCells = [
            randomCellIndex < this.columns ? null : this.cells[randomCellIndex - this.columns],
            (((randomCellIndex + 1) % this.columns) === 0) ? null : this.cells[randomCellIndex + 1],
            (randomCellIndex + 1) > (this.columns * (this.rows - 1)) ? null : this.cells[randomCellIndex + this.columns],
            ((randomCellIndex + 1) % this.columns) === 1 ? null : this.cells[randomCellIndex - 1]
        ];
        randomCell.collapse(neighbouringCells);
    }

    getCells() {
        const transformedCells = [];
        for (let i = 0; i < this.rows; i++) {
            transformedCells.push(this.cells.slice(i * this.columns, ((i + 1) * this.columns)));
        }
        return transformedCells;
    }
}

const waveFunctionCollapse = new WaveFunctionCollapse(GRID_ROWS, GRID_COLUMNS);

const WIN_WIDTH = 800;
const WIN_HEIGHT = 800;
const BACKGROUND_COLOR = '#fff'
const LINE_COLOR = 'black';

const s = p => {
    p.setup = function () {
        p.createCanvas(WIN_WIDTH, WIN_HEIGHT);
        p.background(BACKGROUND_COLOR)
        p.noLoop();
    };

    p.draw = function () {
        const cells = waveFunctionCollapse.getCells();
        if (cells.length === 0) {
            throw new Error('There must be more than 0 cells')
        }
        const cellHeight = p.width / cells.length
        const cellWidth = p.height / cells[0].length
        for (let row in cells) {
            for (let column in cells[row]) {
                const cell = cells[row][column];
                if (cell.getCollapsed()) {
                    const cellGraphics = p.createGraphics(cellWidth, cellHeight)
                    cellGraphics.background(BACKGROUND_COLOR);
                    cellGraphics.stroke(LINE_COLOR);
                    cellGraphics.strokeWeight(1);
                    cellGraphics.noFill();
                    const tile = cell.getTile()
                    const tileFigures = tile.getFigures();
                    for (let figureIndex in tileFigures) {
                        const figure = tileFigures[figureIndex];
                        cellGraphics.beginShape();
                        for (let coordinate = 0; coordinate < figure.length; coordinate += 2) {
                            cellGraphics.vertex(figure[coordinate] * cellWidth, figure[coordinate + 1] * cellHeight);
                        }
                        cellGraphics.endShape();
                    }
                    p.image(cellGraphics, cellWidth * column, cellHeight * row)
                }
            }
        }
    };

    p.mousePressed = () => {
        waveFunctionCollapse.collapseSingle();
        p.redraw();
    }
}

new p5(s);