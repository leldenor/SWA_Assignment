<script lang="ts">
import * as api from '@/api'
import type { User } from '@/model/model'

export default {
    data() {
        return {
            username: "",
            password: "",
        };
    },
    emits: {
        onFinish(token: string, user: User) {
            return true;
        }
    },
    methods: {
        async onFinish() {
            const token = await api.login({ password: this.password, username: this.username, id: -1 });
            console.log(token);
            const user = { id: token.userId, username: this.username, password: this.password };
            this.$emit("onFinish", token.token, user);
        }
    },
}
</script>

<template>
    <form @submit.prevent="onFinish">
        <label>Username:</label>
        <input type="username" required v-model="username">
        <label>Password:</label>
        <input type="password" required v-model="password">
        <button @click.prevent="onFinish">Login</button>
    </form>
</template>