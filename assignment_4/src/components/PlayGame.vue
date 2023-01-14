<script lang="ts">
import { type Board, type Tile, type Position, create, move, type Game, type User } from '@/model/model';
import { ref, type PropType } from 'vue';
import * as api from '@/api'

const initBoard: Board = create(5, 4)
const board = ref(initBoard)

export default {
    data() {
        return {
            tiless: [] as Position[],
            board
        }
    },
    props: {
        game: {
            type: Object as PropType<Game>,
            require: true
        },
        token: {
            type: String as PropType<string>,
            required: true
        },
        player: {
            type: Object as PropType<User>,
            required: true
        }
    },
    emits: {
        profile(_: string, user: User) {
            return true
        }
    },
    methods: {
        tiles(row: number): Tile[] {
            //get board from model
            return this.board.tiles.filter(x => {
                return x.position.row == row
            })
        },
        makeMove(tile: Position) {
            this.tiless.push(tile)
            console.log(this.tiless);

            if (this.tiless.length == 2) {
                this.board = move(this.board, this.tiless[0], this.tiless[1])
                this.tiless = []
            }
        },
        async endGame() {
            if (this.game) {
                this.game.score = this.board.score
                await api.updateGame(this.game, this.token)
                this.$emit('profile', this.token, this.player)
            }
        }
    }
}
</script>

<template>
    <h2>Score {{ board.score }}</h2>
    <table>
        <tr>
            <td v-for='tile in tiles(1)'><button @click='makeMove(tile.position)'>{{ tile.piece }}</button></td>
        </tr>
        <tr>
            <td v-for='tile in tiles(2)'><button @click='makeMove(tile.position)'>{{ tile.piece }}</button></td>
        </tr>
        <tr>
            <td v-for='tile in tiles(3)'><button @click='makeMove(tile.position)'>{{ tile.piece }}</button></td>
        </tr>
        <tr>
            <td v-for='tile in tiles(4)'><button @click='makeMove(tile.position)'>{{ tile.piece }}</button></td>
        </tr>
    </table>
    <br>
    <button @click="endGame">End Game</button>
</template>