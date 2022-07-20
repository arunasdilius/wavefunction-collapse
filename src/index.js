import p5 from 'p5';

const GRID_ROWS = 50;
const GRID_COLUMNS = 50;

const WIN_WIDTH = 1000;
const WIN_HEIGHT = 1000;
const BACKGROUND_COLOR = '#fff'
const LINE_COLOR = 'black';


class Tile {
    edges = [];
    figures = [];
    rotation = 0;

    getFigures() {
        return this.figures;
    }

    getTranslatedEdges() {
        const rotation90Degree = this.rotation / 90;
        const edgesToSlice = this.edges.length - rotation90Degree;
        return this.edges.slice(edgesToSlice).concat(this.edges.slice(0, edgesToSlice));
    }

    rotate90Degrees() {
        this.rotation += 90;
    }

    getRotationDegrees() {
        return this.rotation;
    }
}

class StraightTile extends Tile {
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

class CornerTile extends Tile {
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

class TTile extends Tile {
    edges = [
        1, 1, 0, 1
    ]
    figures = [
        [
            0.0, 0.5,
            1, 0.5,
        ],
        [
            0.5, 0.0,
            0.5, 0.5,
        ],
    ]
}

class ClosedTile extends Tile {
    edges = [
        0, 0, 0, 0
    ]
    figures = [
        [
            0.33, 0.33,
            0.66, 0.33,
            0.66, 0.66,
            0.33, 0.66,
            0.33, 0.33,
        ],
    ]
}

class EndTile extends Tile {
    edges = [
        1, 0, 0, 0
    ]
    figures = [
        [
            0.5, 0.00,
            0.5, 0.33,
        ],
        [
            0.33, 0.33,
            0.66, 0.33,
            0.66, 0.66,
            0.33, 0.66,
            0.33, 0.33,
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

    forceCollapse(){
        this.collapsed = true;
        this.collapsedTile = this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)]
        this.possibleTiles = [];
    }

    collapse(neigbouringCells) {
        for (let i = 0; i < neigbouringCells.length; i++) {
            const neighbouringCell = neigbouringCells[i];
            if (neighbouringCell && neighbouringCell.getCollapsed()) {
                const neighbouringEdge = neighbouringCell.getTile().getTranslatedEdges()[(i + 2) % 4]
                this.possibleTiles = this.possibleTiles.filter(function (possibleTile) {
                    return possibleTile.getTranslatedEdges()[i] === neighbouringEdge
                })
            }
            if (neighbouringCell === null) {
                this.possibleTiles = this.possibleTiles.filter(function (possibleTile) {
                    return possibleTile.getTranslatedEdges()[i] === 0
                })
            }
        }
        this.collapsed = true;
        this.collapsedTile = this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)]
        this.possibleTiles = [];
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
            const originalTiles = [
                new StraightTile(),
                new CornerTile(),
                new CrossTile(),
                new TTile(),
                new ClosedTile(),
                new EndTile()
            ];
            const allTiles = this.prepareTiles(originalTiles);
            this.cells.push(new Cell(allTiles));
        }
    }

    prepareTiles(originalTiles) {
        const allTiles = [];
        for (let i in originalTiles) {
            let uniqueTile = originalTiles[i];
            for (let j = 0; j < 4; j++) {
                allTiles.push(uniqueTile);
                uniqueTile = this.clone(uniqueTile);
                uniqueTile.rotate90Degrees();
            }
        }
        const distinctTiles = [];
        var distinctValues = []
        for (var i = 0; i < allTiles.length; i++) {
            const currentTile = allTiles[i];
            const edges = currentTile.getTranslatedEdges();
            if (distinctValues.indexOf(edges)) {
                distinctValues.push(edges);
                distinctTiles.push(currentTile)
            }
        }
        return distinctTiles;
    }

    clone(obj) {
        return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
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

const s = p => {
    p.setup = function () {
        p.createCanvas(WIN_WIDTH, WIN_HEIGHT);
        p.background(BACKGROUND_COLOR)
        p.frameRate(60)
        // p.noLoop();
    };

    p.draw = function () {
        waveFunctionCollapse.collapseSingle();
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
                    let cellGraphics = p.createGraphics(cellWidth, cellHeight)
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
                    p.angleMode(p.DEGREES);
                    p.push();
                    p.translate((cellWidth * column) + (cellWidth / 2), (cellHeight * row) + (cellHeight / 2));
                    p.rotate(tile.getRotationDegrees())
                    p.image(cellGraphics, -0.5 * cellWidth, -0.5 * cellHeight)
                    p.pop()
                    cellGraphics.remove();
                    // p.rect(cellWidth * column, cellHeight * row, cellWidth, cellHeight)
                }
            }
        }
        p.textSize(10);
        p.rect(0, 0, 45, 15);
        const fps = Math.round((1000 / p.deltaTime) * 10) / 10;
        p.text('fps ' + fps, 5, 10);
    };
    p.mousePressed = () => {
        waveFunctionCollapse.collapseSingle();
        p.redraw();
    }
}

new p5(s);