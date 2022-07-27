import Tile from "./Tile";

export class StraightTile extends Tile {
    edges = [
        0, 1, 0, 1
    ];
    shapes = [
        [
            0, 0.5,
            1, 0.5
        ]
    ];
}

export class CornerTile extends Tile {
    edges = [
        1, 1, 0, 0
    ];
    shapes = [
        [
            0.5, 0.0,
            0.5, 0.5,
            1, 0.5
        ],
    ];
}

export class DiagonalCornerTile extends Tile {
    edges = [
        1, 1, 0, 0
    ];
    shapes = [
        [
            0.5, 0.0,
            1, 0.5
        ],
    ];
}

export class CrossTile extends Tile {
    edges = [
        1, 1, 1, 1
    ];
    shapes = [
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

export class CrossDiagonalTile extends Tile {
    edges = [
        1, 1, 1, 1
    ];
    shapes = [
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

export class TTile extends Tile {
    edges = [
        1, 1, 0, 1
    ];
    shapes = [
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

export class VTile extends Tile {
    edges = [
        1, 1, 0, 1
    ];
    shapes = [
        [
            0.0, 0.5,
            0.5, 0.0,
            1, 0.5,
        ],
    ];
}

export class ClosedTile extends Tile {
    edges = [
        0, 0, 0, 0
    ];
    shapes = [
        [
            0.33, 0.33,
            0.66, 0.33,
            0.66, 0.66,
            0.33, 0.66,
            0.33, 0.33,
        ],
    ];
}

export class EmptyTile extends Tile {
    edges = [
        0, 0, 0, 0
    ];
    shapes = [
        [],
    ];
}

export class EndTile extends Tile {
    edges = [
        1, 0, 0, 0
    ];
    shapes = [
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