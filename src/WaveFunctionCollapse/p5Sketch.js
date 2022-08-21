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
        this.p.stroke(this.config.strokeColor);
        this.p.strokeWeight(this.config.strokeWeight);
    }

    draw() {
        const cells = this.drawPreProcess(this.p);
        if (cells.length === 0) {
            throw new Error("There must be more than 0 cells");
        }
        const cellHeight = this.p.height / cells.length;
        const cellWidth = this.p.width / cells[0].length;
        for (let row in cells) {
            for (let column in cells[row]) {
                const cell = cells[row][column];
                if (!cell.rendered && cell.getCollapsed()) {
                    this.p.push();
                    this.p.noFill();
                    this.p.translate((cellWidth * column), (cellHeight * row));
                    const tile = cell.getTile();
                    if (tile) {
                        this.p.angleMode(this.p.DEGREES);
                        this.p.translate((cellWidth / 2), (cellHeight / 2));
                        this.p.rotate(tile.getRotationDegrees());
                        if ([90, 270].indexOf(tile.getRotationDegrees()) !== -1) {
                            this.p.translate(-(cellHeight / 2), -(cellWidth / 2));
                        }else{
                            this.p.translate(-(cellWidth / 2), -(cellHeight / 2));
                        }
                        let x = cellWidth;
                        let y = cellHeight;
                        if ([90, 270].indexOf(tile.getRotationDegrees()) !== -1) {
                            x = cellHeight;
                            y = cellWidth;
                        }
                        this.drawTileShape(tile, x, y);
                    } else {
                        this.p.stroke(this.config.errorColor);
                        this.p.rect(0, 0, cellWidth, cellHeight);
                    }
                    this.p.pop();
                    cell.setRendered(true);
                }
            }
        }
    }

    drawTileShape(tile, x, y) {
        const tileFigures = tile.getShapes();
        for (let figureIndex in tileFigures) {
            const figure = tileFigures[figureIndex];
            this.p.beginShape();
            for (let coordinate = 0; coordinate < figure.length; coordinate += 2) {
                this.p.vertex(figure[coordinate] * x, figure[coordinate + 1] * y);
            }
            this.p.endShape();
        }
    }
}

export default p5Sketch;