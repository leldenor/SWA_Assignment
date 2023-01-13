var _ = require('lodash');
export type User = {
    id: number,
    username: string,
    password: string,
}

export type Game = {
    id: number,
    user: number,
    score: number,
    completed: boolean
}

export type Position = {
    row: number,
    col: number
}

export type Tile = {
    piece: number,
    position: Position
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type Board = {
    tiles: Tile[],
    height: number,
    width: number,
    score: number
}

// export type Effect<T> = ?;

// export type MoveResult<T> = {
//     board: Board<T>,
//     effects: Effect<T>[]
// }    

export function create(width: number, height: number): Board {
    let board: Tile[] = []

    for (var i: number = 0; i < height; i++) {
        for (var x: number = 0; x < width; x++) {
            board.push({ piece: Math.floor(Math.random() * (6 - 1) + 1), position: { row: i, col: x } })
        }
    }

    return { tiles: board, height, width, score: 0 }
}

export function piece(board: Board, p: Position): number | undefined {
    return _.find(board.tiles, (x: Tile) => { return x.position.row == p.row && x.position.col == p.col })?.piece
}

export function canMove(board: Board, first: Position, second: Position): boolean {
    if (_.isUndefined(piece(board, first)) || _.isUndefined(piece(board, second)))
        return false
    if (first.row != second.row && first.col != second.col)
        return false
    if (first.row === second.row || first.col === second.col) {
        if (checkVertical(board, true).length > 0 || checkHorizontal(board, true).length > 0)
            return true
    }

    return false
}

const checkVertical = (board: Board, isCheck: boolean): Position[] => {
    let check = false
    let count = 0
    let positions: Position[] = []
    let board2: Tile[] = _.cloneDeep(board.tiles)
    board2 = _.sortBy(board2, [(u: Tile) => { return u.position.col }])
    let column = 0
    let somePiece: number = -1
    let thePiece: number
    let allPos: Position[] = []

    board2.forEach(b => {
        console.log("Piecee", somePiece, b);

        if (somePiece != -1) {
            if (b.position.col == column) {
                if (somePiece == b.piece) {
                    console.log("Pieceee", somePiece, b, count);
                    count++
                    positions.push(b.position)
                    thePiece = b.piece
                } else if (count == 1) {
                    positions = []
                    positions.push(b.position)
                    thePiece = b.piece
                } else if (count < 3) {
                    count = 0
                    positions = []
                }

                if (count > 2 && somePiece != b.piece) {
                    check = true
                    _.each(positions, (p: Position) => {
                        allPos.push(p)
                    })
                    count = 0
                    positions = []
                }
            }
        } else {
            count++
            positions.push(b.position)
            thePiece = b.piece
        }

        somePiece = b.piece

        if (b.position.row == board.height - 1) {
            column++
            if (count > 2) {
                check = true
                _.each(positions, (p: Position) => {
                    allPos.push(p)
                })
            }
            count = 0
            positions = []
            somePiece = -1
        }
    });
    console.log(allPos);

    return allPos
}

const checkHorizontal = (board: Board, isCheck: boolean): Position[] => {
    let check = false
    let board2: Tile[] = _.cloneDeep(board.tiles)
    board2 = _.sortBy(board2, [(u: Tile) => { return u.position.row }])
    console.log(board2);

    let count = 0
    let positions: Position[] = []
    let row = 0
    let somePiece: number = -1
    let thePiece: number
    let allPos: Position[] = []
    board2.forEach(b => {
        console.log("PieceeH", somePiece, b);
        if (somePiece != -1) {
            if (b.position.row == row) {
                if (somePiece == b.piece) {
                    console.log("PieceeH", somePiece, b, count);

                    count++
                    positions.push(b.position)
                    thePiece = b.piece
                } else if (count == 1) {
                    positions = []
                    positions.push(b.position)
                    thePiece = b.piece
                } else if (count < 3) {
                    count = 0
                    positions = []
                }
                console.log(count);

                if (count > 2 && somePiece != b.piece) {
                    check = true
                    console.log(positions);

                    _.each(positions, (p: Position) => {
                        allPos.push(p)
                    })
                    count = 0
                    positions = []
                }
            }
        } else {
            count++
            positions.push(b.position)
            thePiece = b.piece
        }

        somePiece = b.piece

        if (b.position.col == board.width - 1) {
            row++

            if (count > 2) {
                check = true
                _.each(positions, (p: Position) => {
                    allPos.push(p)
                })
            }
            count = 0
            positions = []
            somePiece = -1
        }
    });
    console.log(allPos);

    return allPos
}

const replaceTiles = (board: Board, allPos: Position[]): Board => {
    let positions: Position[] = _.cloneDeep(allPos)
    let newBoard: Tile[] = _.cloneDeep(board.tiles)
    positions = _.sortBy(positions, [(u: Position) => { return u.row }, (u: Position) => { return u.col }])
    positions = _.uniqWith(positions, (x: Position, y: Position) => { return x.row == y.row && x.col == y.col })

    positions.forEach(p => {
        let col = _.filter(newBoard, (x: Tile) => { return x.position.col == p.col && x.position.row <= p.row })
        _.pullAllWith(newBoard, col, (x: Tile, y: Tile) => { return x.position.row == y.position.row && x.position.col == y.position.col })

        _.map(col, (c: Tile) => {
            if (!(p.row == c.position.row && p.col == c.position.col)) {
                let piece = { piece: c.piece, position: { row: c.position.row + 1, col: c.position.col } }

                newBoard.push(piece)
            }
        })
        let piece = { piece: Math.floor(Math.random() * (6 - 1) + 1), position: { row: 0, col: p.col } }
        newBoard.push(piece)
    });

    newBoard = _.sortBy(newBoard, [(u: Tile) => { return u.position.row }])
    let ret: Board = { tiles: newBoard, height: board.height, width: board.width, score: (board.score + positions.length) }
    let canMove = checkHorizontal(ret, false)
    let canMove2 = checkVertical(ret, false)

    if (canMove.length > 0 || canMove2.length > 0)
        replaceTiles(ret, _.concat(canMove, canMove2))

    return ret
}

export function move(board: Board, first: Position, second: Position): Board {
    const piece1 = piece(board, second)
    const piece2 = piece(board, first)
    let board2: Tile[] = _.cloneDeep(board.tiles)
    let index: number = _.findIndex(board2, (b: Tile) => { return b.position.row == first.row && b.position.col == first.col })
    if (piece1 && piece2) {
        board2[index] = { piece: piece1, position: first }
        index = _.findIndex(board2, (b: Tile) => { return b.position.row == second.row && b.position.col == second.col })
        board2[index] = { piece: piece2, position: second }
        let newBoard: Board = { tiles: board2, height: board.height, width: board.width, score: board.score }
        console.warn(newBoard);
        let can = canMove(newBoard, first, second)
        console.log(can);

        if (can) {

            const l1 = checkHorizontal(newBoard, false)
            const l2 = checkVertical(newBoard, false)


            return replaceTiles(newBoard, _.concat(l1, l2))
        }
    }

    return board
}

