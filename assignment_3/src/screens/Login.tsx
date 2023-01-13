import { Form, message, Input, Button } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { registerThunk, login } from "../thunks"
import { Dispatch, State } from "../store"
import { useEffect, useState } from "react"

export const Login = () => {
    const [choice, setChoice] = useState("")
    const dispatch: Dispatch = useDispatch()
    const gameState = useSelector((s: State) => s.game)

    useEffect(() => {
        if (gameState.token)
            setChoice("login")
    }, [gameState])

    const onFinish = (values: any) => {
        if (choice == "login")
            dispatch(login(values))
        if (choice == "register")
            dispatch(registerThunk(values))
    }

    switch (choice) {
        case "register":
            return <LoginForm onFinish={onFinish} button="Register" />
        case "login":
            return <LoginForm onFinish={onFinish} button="Login" />
        default:
            return (
                <>
                    <Button onClick={() => setChoice("register")}>Register</Button>
                    <Button onClick={() => setChoice("login")}>Login</Button>
                </>
            )
    }



}

export const LoginForm = (props: any) => {

    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={props.onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        {props.button}
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}