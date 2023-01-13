import { Game, User } from "./model/model"

const callServer = async <Return>(url: string, init: RequestInit = {}): Promise<Return> => {
    const response = await fetch(url, { ...init, headers: { ...init.headers, 'Accept': 'application/json', 'Content-Type': 'application/json' } })
    if (response.ok) {
        return response.json()
    } else {
        return Promise.reject<Return>(response.statusText)
    }
}

const read = async <Return>(url: string): Promise<Return> => callServer<Return>(url)
const create = async <Body, Return>(url: string, body: Body): Promise<Return> => callServer<Return>(url, { method: 'POST', body: JSON.stringify(body) })
const createGame = async <Return>(url: string): Promise<Return> => callServer<Return>(url, { method: 'POST' })
// const patchGame = async (gameNumber: number, token: string, body: Game): Promise<Return> => callServer<string>(`http://localhost:9090/games/${gameNumber}?token=${token}`, { method: 'PATCH', body: JSON.stringify(body) })

export const register = (player: User) => create<{ username: string, password: string }, User>('http://localhost:9090/users', { username: player.username, password: player.password })

export const login = (player: User) => create<{ username: string, password: string }, { token: string, userId: any }>('http://localhost:9090/login', { username: player.username, password: player.password })

export const logout = (player: User) => create<{ player: User }, User>('http://localhost:9090/logout', { player })

export const newGame = (token: string) => createGame<Game>(`http://localhost:9090/games?token=${token}`)

export const updateGame = async (game: Game, token: string) => {
    const response = await fetch(`http://localhost:9090/games/${game.id}?token=${token}`, { method: 'PATCH', body: JSON.stringify(game), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
    if (response.ok) {
        return token
    } else {
        return Promise.reject(response.statusText)
    }
}

export const getGames = () => read<Game[]>('http://localhost:9090/game')

