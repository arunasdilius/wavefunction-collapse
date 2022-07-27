import p5 from "p5";

class p5Structure {
    p;
    config = {
        resolutionWidth: 100,
        resolutionHeight: 100,
        backgroundColor: '#fff',
        maxFramerate: 140,
    }
    framerate = 0;

    constructor(p, config = {}) {
        this.p = p;
        this.config = Object.assign(this.config, config);
    }

    setup(){
        this.p.createCanvas(this.config.resolutionWidth, this.config.resolutionHeight);
        this.p.background(this.config.backgroundColor);
        this.p.frameRate(this.config.maxFramerate);
    }

    draw () {
        waveFunctionCollapse.iterate();
        const cells = waveFunctionCollapse.getCells();
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
                    this.p.stroke(LINE_COLOR);
                    this.p.strokeWeight(1);
                    this.p.noFill();
                    this.p.translate((cellWidth * column), (cellHeight * row));
                    const tile = cell.getTile();
                    if(tile){
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
                    }else{
                        this.p.stroke(ERROR_COLOR);
                        this.p.rect(0, 0, cellWidth, cellHeight);
                    }
                    this.p.pop();
                    cell.setRendered(true);
                }
            }
        }
        this.framerate = Math.round((1000 / this.p.deltaTime) * 10) / 10;
    };

    mousePressed() {
        if (this.p.isLooping()) {
            this.p.noLoop();
        } else {
            this.p.loop();
        }
        this.p.redraw();
    };

}

const s = p => {
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

new p5(s);