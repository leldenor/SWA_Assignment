<script lang="ts">
import * as api from '@/api'
import type { User } from '@/model/model'

export default {
    data() {
        return {
            username: "",
            password: ""
        };
    },
    emits: {
        viewButton(_: string) {
            return 'login'
        }
    },
    methods: {
        async onFinish() {
            const user = await api.register({ password: this.password, username: this.username, id: -1 })
            console.log(user);

            this.$emit("viewButton", "login");
        },
    }
}
</script>

<template>
    <form @submit.prevent="onFinish">
        <label>Username:</label>
        <input type="username" required v-model="username">
        <label>Password:</label>
        <input type="password" required v-model="password">
        <button @click.prevent="onFinish">Register</button>
    </form>
</template>