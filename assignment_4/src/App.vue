<script lang="ts">
import Login from "./components/Login.vue"
import HighScores from "./components/HighScores.vue"
import PlayGame from "./components/PlayGame.vue"
import Profile from "./components/Profile.vue"
import type { Board, Game, GameState, Tile, User } from "./model/model"

type AppState = {
  gameState: GameState
}

export default {
  data(): AppState {
    return {
      gameState: { mode: "login" }
    };
  },
  methods: {
    login() {
      this.gameState.mode = "login";
    },
    play(newGame: Game) {
      this.gameState.mode = "game";
      this.gameState.game = newGame
    },
    score(allGames: Game[]) {
      this.gameState.mode = "score"
      this.gameState.allGames = allGames
      // this.gameState.player = player
    },
    profile(token: string, user: User) {
      this.gameState.mode = "profile"
      this.gameState.token = token
      this.gameState.player = user
    }
  },
  components: { Login, HighScores, PlayGame, Profile },
}

</script>

<template>
  <Login v-if="gameState.mode == 'login'" @profile="profile" />
  <HighScores v-if="gameState.mode == 'score'" :all-games="gameState.allGames || []"
    :player="gameState.player?.id || -1" :token="gameState.token" @play="play" />
  <PlayGame v-if="gameState.mode == 'game'" :game="gameState.game" :token="gameState.token || ''"
    :player="gameState.player || { id: -1, username: '', password: '' }" @profile="profile" />
  <Profile v-if="gameState.mode == 'profile'" :player="gameState.player" :token="gameState.token || ''" @score="score"
    @play="play" @login="login" />
</template>
