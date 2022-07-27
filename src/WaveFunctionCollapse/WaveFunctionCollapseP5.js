import p5 from "p5";

const GRID_ROWS = 200;
const GRID_COLUMNS = 200;

const WIN_WIDTH = 1000;
const WIN_HEIGHT = 1000;
const BACKGROUND_COLOR = "#fff";
const LINE_COLOR = "#737373";
const ERROR_COLOR = "red";

import WaveFunctionCollapse from "./WaveFunctionCollapse/WaveFunctionCollapse";
import {
    ClosedTile,
    CornerTile, CrossDiagonalTile,
    CrossTile,
    DiagonalCornerTile, EmptyTile,
    EndTile,
    StraightTile,
    TTile, VTile
} from "./WaveFunctionCollapse/Tileset";

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const originalTiles = [
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
    return originalTiles;
}

shuffleTileWeights(originalTiles);
const waveFunctionCollapse = new WaveFunctionCollapse(GRID_ROWS, GRID_COLUMNS, originalTiles);

// waveFunctionCollapse.collapse();
const waveFunctionCollapseP5 = p => {
    p.setup = function () {
        p.createCanvas(WIN_WIDTH, WIN_HEIGHT);
        p.background(BACKGROUND_COLOR);
        p.frameRate(140);
        // p.noLoop();
    };

    p.draw = function () {
        waveFunctionCollapse.iterate();
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
                    if(tile){
                        const tileFigures = tile.getShapes();
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
                    }else{
                        p.stroke(ERROR_COLOR);
                        p.rect(0, 0, cellWidth, cellHeight);
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

export default waveFunctionCollapseP5;