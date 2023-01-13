import React, { useState } from 'react';
import logo from './logo.svg';
import 'antd/dist/reset.css';
import './App.css';
import { Login } from './screens/Login';
import { useSelector } from 'react-redux';
import { State } from './store';
import { Profile } from './screens/Profile';
import { PlayGame } from './screens/PlayGame';
import { HighScores } from './screens/HighScores';

function App() {
  const gameState = useSelector((s: State) => s.game)
  console.log(gameState);

  switch (gameState.mode) {
    case "login":
      return <Login />
    case "profile":
      return <Profile />
    case "game":
      return <PlayGame />
    case "score":
      return <HighScores />
    default:
      return <div />
  }
}

export default App;
