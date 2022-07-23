class Tile {
    weight = 1;
    edges = [];
    shapes = [];
    rotation = 0;

    getShapes() {
        return this.shapes;
    }

    getWeight() {
        return this.weight;
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
export default Tile;