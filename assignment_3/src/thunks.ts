import { Dispatch, ThunkAction } from "@reduxjs/toolkit"
import { Game, User } from "./model/model"
import { gameSlice, GetState } from "./store"
import * as api from "./api"

export const registerThunk = (player: User) => {
    return async function (dispatch: Dispatch, _: GetState) {
        const user = await api.register(player)
        dispatch(gameSlice.actions.register(user))
    }
}
export const login = (player: User) => {
    return async function (dispatch: Dispatch, _: GetState) {
        const user = await api.login(player)
        dispatch(gameSlice.actions.login({ token: user.token, player: { id: user.userId, username: player.username, password: player.password } }))
    }
}
export const logout = (player: User) => {
    return async function (dispatch: Dispatch, _: GetState) {
        await api.logout(player)
        dispatch(gameSlice.actions.logout())
    }
}
export const newGame = (token: string, player: User) => {
    return async function (dispatch: Dispatch, _: GetState) {
        const game = await api.newGame(token)
        dispatch(gameSlice.actions.newGame({ player: player, game, token }))
    }
}
export const updateGame = (oGame: Game, token: string, player: User) => {
    return async function (dispatch: Dispatch, _: GetState) {
        const tok = await api.updateGame(oGame, token)
        dispatch(gameSlice.actions.setGame({ token: tok, player }))
    }
}

export const getGame = (player: User, token: string) => {
    return async function (dispatch: Dispatch, _: GetState) {
        const game = await api.getGames()
        dispatch(gameSlice.actions.scores({ token, player }))
    }
}

export const profile = (player: User, token: string) => {
    return function (dispatch: Dispatch, _: GetState) {
        dispatch(gameSlice.actions.profile({ player, token }))
    }
}

export const scores = (token: string, player: User) => {
    return function (dispatch: Dispatch, _: GetState) {
        dispatch(gameSlice.actions.scores({ player, token }))
    }
}