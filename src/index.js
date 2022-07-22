import p5 from "p5";

const GRID_ROWS = 100;
const GRID_COLUMNS = 100;

const WIN_WIDTH = 1000;
const WIN_HEIGHT = 1000;
const BACKGROUND_COLOR = "#fff";
const LINE_COLOR = "#737373";
const ERROR_COLOR = "red";

import Tile from "./WaveFunctionCollapse/Tile";
import WaveFunctionCollapse from "./WaveFunctionCollapse/WaveFunctionCollapse";


class StraightTile extends Tile {
    edges = [
        0, 1, 0, 1
    ];
    figures = [
        [
            0, 0.5,
            1, 0.5
        ]
    ];
}
class StraightDoubleTile extends Tile {
    edges = [
        0, 2, 0, 2
    ];
    figures = [
        [
            0, 0.4,
            1, 0.4
        ],
        [
            0, 0.6,
            1, 0.6
        ]
    ];
}
class StraightSingleToDoubleTile extends Tile {
    edges = [
        0, 2, 0, 1
    ];
    figures = [
        [
            0, 0.5,
            1, 0.4
        ],
        [
            0, 0.5,
            1, 0.6
        ]
    ];
}
class StraightDoubleEnd extends Tile {
    edges = [
        0, 0, 0, 2
    ];
    figures = [
        [
            0, 0.4,
            0.5, 0.5
        ],
        [
            0, 0.6,
            0.5, 0.5
        ]
    ];
}

class CornerTile extends Tile {
    weight = 1;
    edges = [
        1, 1, 0, 0
    ];
    figures = [
        [
            0.5, 0.0,
            0.5, 0.5,
            1, 0.5
        ],
    ];
}

class DiagonalCornerTile extends Tile {
    weight = 100;
    edges = [
        1, 1, 0, 0
    ];
    figures = [
        [
            0.5, 0.0,
            1, 0.5
        ],
    ];
}

class CrossTile extends Tile {
    weight = 1;
    edges = [
        1, 1, 1, 1
    ];
    figures = [
        [
            0.0, 0.5,
            1, 0.5,
        ],
        [
            0.5, 0.0,
            0.5, 1.0,
        ],
    ];
}

class CrossDiagonalTile extends Tile {
    weight = 50;
    edges = [
        1, 1, 1, 1
    ];
    figures = [
        [
            0.5, 0.0,
            0.5, 0.33,
        ],
        [
            0.66, 0.5,
            1, 0.5,
        ],
        [
            0.5, 0.66,
            0.5, 1,
        ],
        [
            0.0, 0.5,
            0.33, 0.5,
        ],
        [
            0.5, 0.33,
            0.66, 0.5,
            0.5, 0.66,
            0.33, 0.5,
            0.5, 0.33,
        ],
    ];
}

class TTile extends Tile {
    weight = 1;
    edges = [
        1, 1, 0, 1
    ];
    figures = [
        [
            0.0, 0.5,
            1, 0.5,
        ],
        [
            0.5, 0.0,
            0.5, 0.5,
        ],
    ];
}

class VTile extends Tile {
    weight = 1;
    edges = [
        1, 1, 0, 1
    ];
    figures = [
        [
            0.0, 0.5,
            0.5, 0.0,
            1, 0.5,
        ],
    ];
}

class ClosedTile extends Tile {
    weight = 1;
    edges = [
        0, 0, 0, 0
    ];
    figures = [
        [
            0.33, 0.33,
            0.66, 0.33,
            0.66, 0.66,
            0.33, 0.66,
            0.33, 0.33,
        ],
    ];
}

class EmptyTile extends Tile {
    weight = 1;
    edges = [
        0, 0, 0, 0
    ];
    figures = [
        [],
    ];
}

class EndTile extends Tile {
    weight = 1;
    edges = [
        1, 0, 0, 0
    ];
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
    ];
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const originalTiles = [
    // new StraightDoubleTile(),
    // new StraightSingleToDoubleTile(),
    // new StraightDoubleEnd(),
    new StraightTile(),
    new CornerTile(),
    new CrossTile(),
    new TTile(),
    new ClosedTile(),
    new EndTile(),
    new DiagonalCornerTile(),
    new EmptyTile(),
    new CrossDiagonalTile(),
    new VTile(),
];

function shuffleTileWeights()
{
    let randomPool = 1000;
    let randoms = [];
    for (let i = 0; i < originalTiles.length; i++) {
        let random = Math.floor(Math.random() * randomPool);
        randomPool -= random;
        random = random ? random : 1;
        randoms.push(random);
    }
    randoms = shuffle(randoms);
    for (let tileIndex in originalTiles) {
        originalTiles[tileIndex].weight = randoms[tileIndex];
    }
}
const waveFunctionCollapse = new WaveFunctionCollapse(GRID_ROWS, GRID_COLUMNS, originalTiles);
shuffleTileWeights(originalTiles);
waveFunctionCollapse.collapse();
const s = p => {
    p.setup = function () {
        p.createCanvas(WIN_WIDTH, WIN_HEIGHT);
        p.background(BACKGROUND_COLOR);
        p.frameRate(140);
        p.noLoop();
    };

    p.draw = function () {
        // waveFunctionCollapse.iterate();
        const cells = waveFunctionCollapse.getCells();
        if (cells.length === 0) {
            throw new Error("There must be more than 0 cells");
        }
        const cellHeight = p.width / cells.length;
        const cellWidth = p.height / cells[0].length;
        for (let row in cells) {
            for (let column in cells[row]) {
                const cell = cells[row][column];
                if (!cell.rendered && cell.getCollapsed()) {
                    p.push();
                    p.stroke(LINE_COLOR);
                    p.strokeWeight(1);
                    p.noFill();
                    p.translate((cellWidth * column), (cellHeight * row));
                    const tile = cell.getTile();
                    const tileFigures = tile.getFigures();
                    p.angleMode(p.DEGREES);
                    p.translate((cellWidth / 2), (cellHeight / 2));
                    p.rotate(tile.getRotationDegrees());
                    p.translate(-(cellWidth / 2), -(cellHeight / 2));
                    for (let figureIndex in tileFigures) {
                        const figure = tileFigures[figureIndex];
                        p.beginShape();
                        for (let coordinate = 0; coordinate < figure.length; coordinate += 2) {
                            p.vertex(figure[coordinate] * cellWidth, figure[coordinate + 1] * cellHeight);
                        }
                        p.endShape();
                    }
                    p.pop();
                    cell.setRendered(true);
                }
            }
        }
        p.textSize(10);
        p.rect(0, 0, 45, 15);
        const fps = Math.round((1000 / p.deltaTime) * 10) / 10;
        p.text("fps " + fps, 5, 10);
    };
    p.mousePressed = () => {
        if (p.isLooping()) {
            p.noLoop();
        } else {
            p.loop();
        }
        p.redraw();
    };
};

new p5(s);