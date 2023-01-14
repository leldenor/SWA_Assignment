<script lang="ts">
import type { PropType } from 'vue';
import type { Game } from '../model/model'
import * as api from '@/api'
import _ from 'lodash'

export default {
    props: {
        allGames: {
            type: Array as PropType<Game[]>,
            required: true
        },
        player: {
            type: Number as PropType<number>,
            required: true
        },
        token: {
            type: String as PropType<string>,
            requred: true
        }
    },
    emits: {
        play(_: Game) {
            return true
        }
    },
    methods: {
        allScores(): Game[] {
            let sorted = _.orderBy(this.allGames, [(u: Game) => { return u.score }], ['desc'])
            let list = _.take(sorted, 10)
            console.log(list);

            return list
        },
        myScores(): Game[] {
            let sorted = _.orderBy(this.allGames, [(u: Game) => { return u.score }], ['desc'])
            let userScores: Game[] = _.filter(sorted, (x: Game) => { return x.user == this.player })
            return _.take(userScores, 3)
        },
        async playGame() {
            console.log(this.token);

            let game = await api.newGame(this.token || "")
            this.$emit('play', game)
        }
    }
}
</script>

<template>
    <h1>TOP 10 Scores</h1>
    <table>
        <tr v-for="game in allScores()">
            <td>{{ game.score }}</td>
        </tr>
    </table>
    <h1>My TOP 3 Scores</h1>
    <table>
        <tr v-for="game in myScores()">
            <td>{{ game.score }}</td>
        </tr>
    </table>
    <button @click="playGame">Play</button>
</template>