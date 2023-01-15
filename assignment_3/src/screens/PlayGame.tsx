import { Avatar, Button } from "antd"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Board, create, move, Tile } from "../model/model"
import { Dispatch, State } from "../store"
import { updateGame } from "../thunks"

export const PlayGame = () => {
    const [selectedTile, setSelectedTile] = useState<Tile>({ piece: -1, position: { row: -1, col: -1 } })
    const [board, setBoard] = useState<Board>({ tiles: [], width: 0, height: 0, score: 0 })
    const gameState = useSelector((s: State) => s.game)
    const dispatch: Dispatch = useDispatch()

    useEffect(() => {
        setBoard(create(4, 4))
    }, [])

    const onSelectTile = (tile: Tile) => {

        if (selectedTile.piece != -1) {

            let s = move(board, tile.position, selectedTile.position)

            setBoard(s)
            setSelectedTile({ piece: -1, position: { row: -1, col: -1 } })
        } else {
            setSelectedTile(tile)
        }
    }

    const endGame = () => {
        let gameM = _.cloneDeep(gameState)
        if (gameM.game) {
            gameM.game.score = board.score

            dispatch(updateGame(gameM.game, (gameState.token || ""), gameM.player || { id: -1, username: "", password: "" }))
        }
    }

    return (
        <>
            <h1>Score {board.score}</h1>
            <table>
                <tbody>
                    <tr>
                        {_.map(board.tiles, (c: Tile) => {
                            if (c.position.row == 0) {
                                return (<td key={c.position.col + "" + c.position.row}>
                                    <Button onClick={() => onSelectTile(c)} disabled={c == selectedTile}>{c.piece}</Button></td>)
                            }
                        })}
                    </tr>
                    <tr>
                        {_.map(board.tiles, (c: Tile) => {
                            if (c.position.row == 1) {
                                return (<td key={c.position.col + "" + c.position.row}>
                                    <Button onClick={() => onSelectTile(c)} disabled={c == selectedTile}>{c.piece}</Button></td>)
                            }
                        })}
                    </tr>
                    <tr>
                        {_.map(board.tiles, (c: Tile) => {
                            if (c.position.row == 2) {
                                return (<td key={c.position.col + "" + c.position.row}>
                                    <Button onClick={() => onSelectTile(c)} disabled={c == selectedTile}>{c.piece}</Button></td>)
                            }
                        })}
                    </tr>
                    <tr>
                        {_.map(board.tiles, (c: Tile) => {
                            if (c.position.row == 3) {
                                return (<td key={c.position.col + "" + c.position.row}>
                                    <Button onClick={() => onSelectTile(c)} disabled={c == selectedTile}>{c.piece}</Button></td>)
                            }
                        })}
                    </tr>

                </tbody>
            </table>
            <Button onClick={endGame}>End Game</Button>
        </>
    )
}