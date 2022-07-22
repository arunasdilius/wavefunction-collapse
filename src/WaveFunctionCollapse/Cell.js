class Cell {
    propagates = false;
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

    setCollapsed(collapsed) {
        this.collapsed = collapsed;
        return this;
    }

    getPropagates() {
        return this.propagated;
    }

    setPropagates(propagated) {
        this.propagated = propagated;
        return this;
    }

    getTile() {
        return this.collapsedTile;
    }

    forceCollapse() {
        this.collapsed = true;
        this.collapsedTile = this.possibleTiles[Math.floor(Math.random() * this.possibleTiles.length)];
        this.possibleTiles = [];
    }

    reduceEntropy(neighbouringCells) {
        const originalPossibleTilesLength = this.possibleTiles.length;
        for (let i = 0; i < neighbouringCells.length; i++) {
            const neighbouringCell = neighbouringCells[i];
            if (neighbouringCell) {
                const possibleNeighbouringTiles = neighbouringCell.getPossibleTiles();
                const possibleNeighbouringEdges = [];
                for (let tileIndex in possibleNeighbouringTiles) {
                    const possibleNeighbouringTile = possibleNeighbouringTiles[tileIndex];
                    const possibleNeighbouringEdge = possibleNeighbouringTile.getTranslatedEdges()[(i + 2) % 4];
                    if (possibleNeighbouringEdges.indexOf(possibleNeighbouringEdge) === -1) {
                        possibleNeighbouringEdges.push(possibleNeighbouringEdge);
                    }
                }
                this.possibleTiles = this.possibleTiles.filter(function (possibleTile) {
                    return possibleNeighbouringEdges.indexOf(possibleTile.getTranslatedEdges()[i]) !== -1;
                });
            } else {
                this.possibleTiles = this.possibleTiles.filter(function (possibleTile) {
                    return possibleTile.getTranslatedEdges()[i] === 0;
                });
            }
        }
        this.setPropagates(false);
        if (originalPossibleTilesLength !== this.possibleTiles.length) {
            for (let i = 0; i < neighbouringCells.length; i++) {
                const neighbouringCell = neighbouringCells[i];
                if (neighbouringCell && !neighbouringCell.getCollapsed()) {
                    neighbouringCell.setPropagates(true)
                }
            }
        }
    }

    collapse() {
        this.setPropagates(false);
        this.setCollapsed(true);
        let weights = [];
        for (let l = 0; l < this.possibleTiles.length; l++) {
            weights = weights.concat(Array(this.possibleTiles[l].getWeight()).fill(l));
        }
        const collapsedTileIndex = weights[Math.floor(Math.random() * weights.length)];
        this.collapsedTile = this.possibleTiles[collapsedTileIndex];
        this.possibleTiles = [this.collapsedTile];
    }
}

export default Cell;