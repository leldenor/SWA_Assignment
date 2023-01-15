import { Button, message, Form, Input } from "antd"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { User } from "../model/model"
import { Dispatch, State } from "../store"
import { newGame, scores, logout } from "../thunks"

export const Profile = () => {
    const gameState = useSelector((s: State) => s.game)

    const updateUser = async (values: any) => {
        const response = await fetch(`http://localhost:9090/users/${gameState.player?.id}?token=${gameState.token}`, { method: 'PATCH', body: JSON.stringify(values), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
        if (response.ok) {
            message.success("Info changd")
        } else {
            return Promise.reject(response.statusText)
        }
    }

    const dispatch: Dispatch = useDispatch()
    return (
        <>
            <Button onClick={() => dispatch(logout(gameState.token || ""))}>Logout</Button>
            <h1>Hello, {gameState.player?.username}</h1>
            <h3>Wanna play</h3>
            <Button onClick={() => (dispatch(newGame(gameState.token || "", gameState.player || { id: -1, password: "", username: "" })))}>Play</Button>
            <Button onClick={() => (dispatch(scores(gameState.token || "", gameState.player || { id: -1, password: "", username: "" })))}>See Scores</Button>

            <div>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={updateUser}
                    autoComplete="off"
                >
                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}