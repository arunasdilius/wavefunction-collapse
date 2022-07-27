import config from "bootstrap/js/src/util/config";

class p5Sketch {
    p;
    config = {
        resolutionWidth: 100,
        resolutionHeight: 100,
        backgroundColor: '#fff',
        maxFramerate: 140,
        strokeColor: '#000',
        strokeWeight: 1,
        errorColor: 'red',
    }
    drawPreProcess = () => {
    };

    constructor(p, config = {}, drawPreProcess) {
        this.p = p;
        this.config = Object.assign(this.config, config);
        this.drawPreProcess = drawPreProcess
    }

    setup() {
        this.p.createCanvas(this.config.resolutionWidth, this.config.resolutionHeight);
        this.p.background(this.config.backgroundColor);
        this.p.frameRate(this.config.maxFramerate);
    }

    draw() {
        const cells = this.drawPreProcess(this.p);
        if (cells.length === 0) {
            throw new Error("There must be more than 0 cells");
        }
        const cellHeight = this.p.width / cells.length;
        const cellWidth = this.p.height / cells[0].length;
        for (let row in cells) {
            for (let column in cells[row]) {
                const cell = cells[row][column];
                if (!cell.rendered && cell.getCollapsed()) {
                    this.p.push();
                    this.p.stroke(this.config.strokeColor);
                    this.p.strokeWeight(this.p.strokeWeight);
                    this.p.noFill();
                    this.p.translate((cellWidth * column), (cellHeight * row));
                    const tile = cell.getTile();
                    if (tile) {
                        const tileFigures = tile.getShapes();
                        this.p.angleMode(this.p.DEGREES);
                        this.p.translate((cellWidth / 2), (cellHeight / 2));
                        this.p.rotate(tile.getRotationDegrees());
                        this.p.translate(-(cellWidth / 2), -(cellHeight / 2));
                        for (let figureIndex in tileFigures) {
                            const figure = tileFigures[figureIndex];
                            this.p.beginShape();
                            for (let coordinate = 0; coordinate < figure.length; coordinate += 2) {
                                this.p.vertex(figure[coordinate] * cellWidth, figure[coordinate + 1] * cellHeight);
                            }
                            this.p.endShape();
                        }
                    } else {
                        this.p.stroke(this.config.errorColor);
                        this.p.rect(0, 0, cellWidth, cellHeight);
                    }
                    this.p.pop();
                    cell.setRendered(true);
                }
            }
        }
    };
}

export default p5Sketch;