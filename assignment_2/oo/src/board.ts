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
    kind: 'Match',
    match: Match<T>
} | { kind: 'Refill' }

export type BoardListener<T> = {

}

export class Board<T> {
    private generator: Generator<T>
    height: number
    width: number
    private listener: BoardListener<T>
    private event: BoardEvent<T>
    private board: T[][]

    constructor(generator: Generator<T>, width: number, height: number) {
        this.generator = generator
        this.height = height
        this.width = width
        this.board = []

        this.createBoard()
    }

    createBoard() {
        let boards: T[][] = []

        for (var i: number = 0; i < this.height; i++) {
            boards[i] = [];
            for (var x: number = 0; x < this.width; x++) {
                boards[i][x] = this.generator.next()
            }
        }
        this.board = boards
    }

    addListener(listener: BoardListener<T>) {
        console.log(listener);

        this.listener = listener
    }

    piece(p: Position): T | undefined {
        if (p.col < 0 || p.col >= this.width || p.row < 0 || p.row >= this.height)
            return undefined
        else {
            return this.board[p.row][p.col]
            // let gen = _.cloneDeep(this.generator)
            // let tile: T
            // for (let i = 0; i < this.height; i++) {
            //     for (let x = 0; x < this.width; x++) {
            //         if (p.col === x && p.row === i) {
            //             tile = gen.next()
            //             return tile
            //         } else
            //             gen.next()
            //     }
            // }
            // return tile

        }
    }

    canMove(first: Position, second: Position): boolean {
        if (_.isUndefined(this.piece(first)) || _.isUndefined(this.piece(second)))
            return false
        // if (this.event.kind !== 'Match')
        //     return false
        if (first.row == second.row && first.col == second.col)
            return false
        if (first.row === second.row || first.col === second.col)
            return true

        return false
    }


    move(first: Position, second: Position) {
        let newBoard = _.cloneDeep(this.board)
        newBoard[first.row][first.col] = this.piece(second)
        newBoard[second.row][second.col] = this.piece(first)
        newBoard = this.checkMatch(newBoard)
        this.board = newBoard
    }

    checkMatch(board): T[][] {
        let matchRow = 0
        for (let i = 0; i < this.height; i++) {
            for (let x = 0; x < this.width; x++) {

            }
        }

        return board
    }

}