<script lang="ts">
import type { Game, User } from '@/model/model';
import type { PropType } from 'vue';
import * as api from '@/api'

export default {
    data() {
        return {
            password: '',
            message: ""
        }
    },
    props: {
        player: {
            type: Object as PropType<User>,
            require: true
        },
        token: {
            type: String as PropType<string>,
            required: true
        }
    },
    emits: {
        score(_: Game[]) {
            return true
        },
        play(_: Game) {
            return true
        },
        login() {
            return true
        }
    },
    methods: {
        async playButton() {
            const game = await api.newGame(this.token)
            this.$emit('play', game)
        },
        async scoresButton() {
            console.log(this.player, this.token);

            const games = await api.getGames(this.token)
            this.$emit('score', games)
        },
        async onFinish() {
            const response = await fetch(`http://localhost:9090/users/${this.player?.id}?token=${this.token}`, { method: 'PATCH', body: JSON.stringify({ password: this.password }), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } })
            if (response.ok) {
                this.message = "Password changed"
            } else {
                this.message = "Something went wrong"
                return Promise.reject(response.statusText)
            }
        },
        async logout() {
            const log = await api.logout(this.token)
            if (log) {
                this.$emit('login')
            }
        }
    }
}
</script>

<template>
    <button @click="logout">Logout</button>
    <br>
    <h1>Welcome {{ player?.username }}</h1>
    <button @click="playButton">Play</button>
    <button @click="scoresButton">See Scores</button>
    <br>
    <br>
    <form @submit.prevent="onFinish">
        <label>New Password:</label>
        <input type="password" required v-model="password">
        <button @click.prevent="onFinish">Change Password</button>
        <br>
        <label>{{ message }}</label>
    </form>
</template>