import { Button, List, message } from "antd"
import { useEffect, useState } from "react"
import _ from "lodash"
import { Game } from "../model/model"
import { useDispatch, useSelector } from "react-redux"
import { Dispatch, State } from "../store"
import { newGame, profile } from "../thunks"

export const HighScores = (props: any) => {
    const [allScores, setAllScores] = useState<Game[]>([])
    const [userScores, setUserScores] = useState<Game[]>([])
    const gameState = useSelector((s: State) => s.game)
    const dispatch: Dispatch = useDispatch()
    useEffect(() => {

        fetch(`http://localhost:9090/games?token=${gameState.token}`)
            .then(res => res.ok ? res.json() : message.error("Something went wrong"))
            .then(
                (data) => {
                    let sorted = _.orderBy(data, [(u) => { return u.score }], ['desc'])
                    setAllScores(_.take(sorted, 10))
                    let userScores: Game[] = _.filter(sorted, (x: Game) => { return x.user == gameState.player?.id })
                    setUserScores(_.take(userScores, 3))
                }
            ).catch(
                err => console.log(err)
            )
    }, [])
    return (
        <>
            <Button onClick={() => dispatch(profile(gameState.player || { id: -1, password: "", username: "" }, gameState.token || ""))}>Profile</Button>
            <Button onClick={() => dispatch(newGame(gameState.token || "", gameState.player || { id: -1, password: "", username: "" }))}>Play</Button>
            <List
                header={<div>TOP 10 Scores</div>}
                bordered
                dataSource={allScores}
                renderItem={(item) => (
                    <List.Item>
                        {item.score}
                    </List.Item>
                )}
            />
            <List
                header={<div>Your TOP 3 Scores</div>}
                bordered
                dataSource={userScores}
                renderItem={(item) => (
                    <List.Item>
                        {item.score}
                    </List.Item>
                )}
            />
        </>
    )
}