<script lang="ts">
import * as api from '@/api'
import type { User } from '@/model/model'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue';

export default {
    data() {
        return {
            view: "none"
        };
    },
    emits: {
        profile(_: string, user: User) {
            return true;
        }
    },
    methods: {
        onFinish(token: string, user: User) {
            this.$emit("profile", token, user);
        },
        viewButton(type: string) {
            this.view = type;
        }
    },
    components: { LoginView, RegisterView }
}
</script>

<template>
    <button @click="viewButton('login')">Login</button>
    <button @click="viewButton('register')">Register</button>
    <LoginView v-if="view == 'login'" @onFinish="onFinish" />
    <RegisterView v-if="view == 'register'" @view-button="viewButton" />
</template>