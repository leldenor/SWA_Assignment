var _ = require('lodash');
export type Generator<T> = { next: () => T }

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type BoardEvent<T> = {
    kind: 'Match' | 'Refill',
    match?: Match<T>
}

export type BoardListener<T> = (event: BoardEvent<T>) => {}

export type Tiles<T> = {
    piece: T,
    position: Position
}

export class Board<T> {
    private generator: Generator<T>
    height: number
    width: number
    private listener: BoardListener<T>
    private board2: Tiles<T>[]
    private matches: Position[]

    constructor(generator: Generator<T>, width: number, height: number) {
        this.generator = generator
        this.height = height
        this.width = width
        this.board2 = []

        this.createBoard()
    }

    createBoard() {
        let board2: Tiles<T>[] = []

        for (var i: number = 0; i < this.height; i++) {
            for (var x: number = 0; x < this.width; x++) {
                board2.push({ piece: this.generator.next(), position: { row: i, col: x } })
            }
        }
        this.board2 = board2
        this.matches = []
    }

    addListener(listener: BoardListener<T>) {
        this.listener = listener
    }

    piece(p: Position): T | undefined {
        if (p.col < 0 || p.col >= this.width || p.row < 0 || p.row >= this.height)
            return undefined
        else {
            let x = _.find(this.board2, (x: Tiles<T>) => {
                return x.position.row == p.row && x.position.col == p.col
            })

            return x?.piece
        }
    }

    canMove(first: Position, second: Position): boolean {
        if (_.isUndefined(this.piece(first)) || _.isUndefined(this.piece(second)))
            return false
        if (first.row != second.row && first.col != second.col)
            return false
        if (first.row === second.row || first.col === second.col) {
            if (this.checkVertical(true) || this.checkHorizontal(true))
                return true
        }

        return false
    }

    checkVertical(isCheck: boolean): boolean {
        let check = false
        let count = 0
        let positions: Position[] = []
        let board2: Tiles<T>[] = _.cloneDeep(this.board2)
        board2 = _.sortBy(board2, [(u: Tiles<T>) => { return u.position.col }])
        let column = 0
        let somePiece: T
        let thePiece: T
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
                        if (!isCheck) {
                            let event: BoardEvent<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }
                            positions.forEach(p => {
                                this.matches.push(p)
                            })
                            this.listener(event)
                        }
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

            if (b.position.row == this.height - 1) {
                column++
                if (count > 2) {
                    check = true
                    if (!isCheck) {
                        let event: BoardEvent<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }
                        positions.forEach(p => {
                            this.matches.push(p)
                        })
                        this.listener(event)
                    }
                }
                count = 0
                positions = []
                somePiece = undefined
            }
        });

        return check
    }

    checkHorizontal(isCheck: boolean): boolean {
        let check = false
        let board2: Tiles<T>[] = _.cloneDeep(this.board2)
        board2 = _.sortBy(board2, [(u: Tiles<T>) => { return u.position.row }])

        let count = 0
        let positions: Position[] = []
        let row = 0
        let somePiece: T
        let thePiece: T

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
                        if (!isCheck) {
                            console.log({ matched: thePiece, positions: positions }, board2);
                            let event: BoardEvent<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }

                            positions.forEach(p => {
                                this.matches.push(p)
                            })
                            this.listener(event)
                        }
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

            if (b.position.col == this.width - 1) {
                row++


                if (count > 2) {
                    check = true
                    if (!isCheck) {
                        console.log({ matched: thePiece, positions: positions }, board2);
                        let event: BoardEvent<T> = { kind: "Match", match: { matched: thePiece, positions: positions } }

                        positions.forEach(p => {
                            this.matches.push(p)
                        })
                        this.listener(event)
                    }
                }
                count = 0
                positions = []
                somePiece = undefined
            }
        });

        return check
    }

    move(first: Position, second: Position) {
        const piece1 = this.piece(second)
        const piece2 = this.piece(first)
        let board2: Tiles<T>[] = _.cloneDeep(this.board2)
        let index: number = _.findIndex(board2, (b: Tiles<T>) => { return b.position.row == first.row && b.position.col == first.col })
        board2[index] = { piece: piece1, position: first }
        index = _.findIndex(board2, (b: Tiles<T>) => { return b.position.row == second.row && b.position.col == second.col })
        board2[index] = { piece: piece2, position: second }
        this.board2 = board2
        if (this.canMove(first, second)) {

            this.checkHorizontal(false)
            this.checkVertical(false)


            this.replaceTiles(board2)
        }
    }

    replaceTiles(board: Tiles<T>[]) {
        board = _.sortBy(board, [(u: Tiles<T>) => { return u.position.col }])

        let positions: Position[] = _.cloneDeep(this.matches)
        let newBoard: Tiles<T>[] = _.cloneDeep(board)
        positions = _.sortBy(positions, [(u: Position) => { return u.row }, (u: Position) => { return u.col }])
        positions = _.uniqWith(positions, (x, y) => { return x.row == y.row && x.col == y.col })

        positions.forEach(p => {
            let col = _.filter(newBoard, (x: Tiles<T>) => { return x.position.col == p.col && x.position.row <= p.row })
            _.pullAllWith(newBoard, col, (x, y) => { return x.position.row == y.position.row && x.position.col == y.position.col })

            _.map(col, (c: Tiles<T>) => {
                if (!(p.row == c.position.row && p.col == c.position.col)) {
                    let piece = { piece: c.piece, position: { row: c.position.row + 1, col: c.position.col } }

                    newBoard.push(piece)
                }
            })
            let piece = { piece: this.generator.next(), position: { row: 0, col: p.col } }
            newBoard.push(piece)
        });

        newBoard = _.sortBy(newBoard, [(u: Tiles<T>) => { return u.position.row }])

        this.listener({ kind: "Refill" })


        this.matches = []
        this.board2 = newBoard

        let canMove = this.checkHorizontal(false)
        let canMove2 = this.checkVertical(false)
        if (canMove || canMove2)
            this.replaceTiles(this.board2)
    }

}