var _ = require('lodash')
export type Generator<T> = { next: () => T }

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type Board<T> = {
    height: number,
    width: number,
    tiles: Tile<T>[]
}

export type Effect<T> = {
    kind: string
    board?: Board<T>
    match?: Match<T>
}

export type MoveResult<T> = {
    board: Board<T>,
    effects: Effect<T>[]
}

export type Tile<T> = {
    piece: T,
    position: Position
}

export function create<T>(generator: Generator<T>, width: number, height: number): Board<T> {
    let tiles: Tile<T>[] = []
    for (var i: number = 0; i < height; i++) {
        for (var x: number = 0; x < width; x++) {
            tiles.push({ piece: generator.next(), position: { row: i, col: x } })
        }
    }
    return { width, height, tiles }
}

export function piece<T>(board: Board<T>, p: Position): T | undefined {
    if (p.col < 0 || p.col >= board.width || p.row < 0 || p.row >= board.height)
        return undefined
    else {
        let x = _.find(board.tiles, (y: Tile<T>) => {
            return y.position.row == p.row && y.position.col == p.col
        })

        return x?.piece
    }
}

export function canMove<T>(board: Board<T>, first: Position, second: Position): boolean {
    if (_.isUndefined(this.piece(board, first)) || _.isUndefined(this.piece(board, second)))
        return false
    if (first.row != second.row && first.col != second.col)
        return false
    if (first.row === second.row || first.col === second.col) {
        const piece1 = piece(board, second)
        const piece2 = piece(board, first)
        let board2: Tile<T>[] = _.cloneDeep(board.tiles)
        let index: number = _.findIndex(board2, (b: Tile<T>) => { return b.position.row == first.row && b.position.col == first.col })
        if (piece1 && piece2) {
            board2[index] = { piece: piece1, position: first }
            index = _.findIndex(board2, (b: Tile<T>) => { return b.position.row == second.row && b.position.col == second.col })
            board2[index] = { piece: piece2, position: second }
            let newBoard: Board<T> = { tiles: board2, height: board.height, width: board.width }

            if (checkVertical(newBoard, true).length > 0 || checkHorizontal(newBoard, true).length > 0)
                return true
        }
    }

    return false
}

export function move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
    let moveRes: MoveResult<T> = { board, effects: [] }
    if (this.canMove(board, first, second)) {
        const piece1 = piece(board, second)
        const piece2 = piece(board, first)
        let board2: Tile<T>[] = _.cloneDeep(board.tiles)
        let index: number = _.findIndex(board2, (b: Tile<T>) => { return b.position.row == first.row && b.position.col == first.col })
        if (piece1 && piece2) {
            board2[index] = { piece: piece1, position: first }
            index = _.findIndex(board2, (b: Tile<T>) => { return b.position.row == second.row && b.position.col == second.col })
            board2[index] = { piece: piece2, position: second }
            let newBoard: Board<T> = { tiles: board2, height: board.height, width: board.width }
            moveRes.board = newBoard

            const l1 = checkHorizontal(newBoard, false)
            const l2 = checkVertical(newBoard, false)
            l2.forEach(x => {
                l1.push(x)
            })
            moveRes.effects = l1
            let some = replaceTiles(generator, newBoard, _.concat(l1, l2), [])
            moveRes = some
        }
    }

    return moveRes
}

function replaceTiles<T>(generator: Generator<T>, board: Board<T>, allPos: Effect<T>[], prevEffects: Effect<T>[]): MoveResult<T> {
    let positions: Position[] = []
    positions = _.flatten(_.map(_.map(allPos, 'match'), 'positions'))

    let newBoard: Tile<T>[] = _.cloneDeep(board.tiles)
    positions = _.sortBy(positions, [(u: Position) => { return u.row }, (u: Position) => { return u.col }])
    positions = _.uniqWith(positions, (x: Position, y: Position) => { return x.row == y.row && x.col == y.col })

    positions.forEach(p => {
        let col = _.filter(newBoard, (x: Tile<T>) => {
            return x.position.col == p.col && x.position.row <= p.row
        })
        _.pullAllWith(newBoard, col, (x: Tile<T>, y: Tile<T>) => { return x.position.row == y.position.row && x.position.col == y.position.col })

        _.each(col, (c: Tile<T>) => {
            if (!(p.row == c.position.row && p.col == c.position.col)) {
                let piece = { piece: c.piece, position: { row: c.position.row + 1, col: c.position.col } }

                newBoard.push(piece)
            }
        })
        let piece = { piece: generator.next(), position: { row: 0, col: p.col } }
        newBoard.push(piece)
    });

    newBoard = _.sortBy(newBoard, [(u: Tile<T>) => { return u.position.row }])

    let ret: Board<T> = { tiles: newBoard, height: board.height, width: board.width }
    allPos.push({ kind: "Refill" })
    let moveRes: MoveResult<T> = { board: ret, effects: _.concat(prevEffects, allPos) }
    let canMove = checkHorizontal(ret, false)
    let canMove2 = checkVertical(ret, false)

    if (canMove.length > 0 || canMove2.length > 0) {
        moveRes = replaceTiles(generator, ret, _.concat(canMove, canMove2), _.concat(prevEffects, allPos))
    }


    return moveRes
}

function checkVertical<T>(board: Board<T>, isCheck: boolean): Effect<T>[] {
    let check = false
    let count = 0
    let positions: Position[] = []
    let board2: Tile<T>[] = _.cloneDeep(board.tiles)
    board2 = _.sortBy(board2, [(u: Tile<T>) => { return u.position.col }])
    let column = 0
    let somePiece: T
    let thePiece: T
    let events: Effect<T>[] = []
    board2.forEach(b => {
        if (!_.isUndefined(somePiece)) {
            if (b.position.col == column) {
                if (somePiece == b.piece) {
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
                    let event: Effect<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }
                    events.push(event)
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
                let event: Effect<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }
                events.push(event)
            }
            count = 0
            positions = []
            somePiece = undefined
        }
    });

    return events
}

function checkHorizontal<T>(board: Board<T>, isCheck: boolean): Effect<T>[] {
    let check = false
    let board2: Tile<T>[] = _.cloneDeep(board.tiles)
    board2 = _.sortBy(board2, [(u: Tile<T>) => { return u.position.row }])

    let count = 0
    let positions: Position[] = []
    let row = 0
    let somePiece: T
    let thePiece: T
    let events: Effect<T>[] = []
    board2.forEach(b => {

        if (!_.isUndefined(somePiece)) {
            if (b.position.row == row) {
                if (somePiece == b.piece) {

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
                    let event: Effect<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }
                    events.push(event)
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
                let event: Effect<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }

                events.push(event)
            }
            count = 0
            positions = []
            somePiece = undefined
        }
    });

    return events
}
