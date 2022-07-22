import Cell from "./Cell";

class RenderableCell extends Cell {
    rendered = false;

    setRendered(rendered){
        this.rendered = rendered;
        return this;
    }
}

export default RenderableCell;