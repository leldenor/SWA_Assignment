import { configureStore, PayloadAction, Action, createSlice } from '@reduxjs/toolkit'
import { User, Game } from './model/model'

export type GamePayload = {
    player?: User,
    game?: Game,
    token: string
}

export type GameState = { mode: 'game' | 'profile' | 'score' | 'login', player?: User, game?: Game, token?: string }
export const emptyGameState: GameState = { mode: 'login' }

const gameReducers = {
    newGame(_: GameState, action: PayloadAction<GamePayload>): GameState {
        return { mode: 'game', ...action.payload }
    },
    setGame(_: GameState, action: PayloadAction<GamePayload>): GameState {
        return { mode: 'profile', ...action.payload }
    },
    logout(_: GameState, __: Action): GameState {
        return { mode: 'login' }
    },
    login(_: GameState, action: PayloadAction<GamePayload>): GameState {
        return { mode: "profile", ...action.payload }
    },
    scores(_: GameState, action: PayloadAction<GamePayload>): GameState {
        return { mode: "score", ...action.payload }
    },
    register(_: GameState, action: PayloadAction<User>): GameState {
        return { mode: "login", player: action.payload }
    },
    profile(_: GameState, action: PayloadAction<GamePayload>): GameState {
        return { mode: "profile", ...action.payload }
    }
}

export const gameSlice = createSlice<GameState, typeof gameReducers>({
    name: 'game',
    initialState: emptyGameState,
    reducers: gameReducers
})

export type State = { game: GameState }

export const store = configureStore<State>({
    reducer: { game: gameSlice.reducer }
})

export type StoreType = typeof store
export type Dispatch = StoreType['dispatch']
export type GetState = StoreType['getState']
export type Subscriber = Parameters<StoreType['subscribe']>[0]
