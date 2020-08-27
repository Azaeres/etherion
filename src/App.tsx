import React from 'react';
import PhaserGame from './features/game/PhaserGame';
import './App.css';
import './fonts.css';
import { version } from '../package.json';

console.info(`Etherion v{version}`);

function App(props: any) {
  return (
    <div className="App">
      <PhaserGame />
    </div>
  );
}

export default App;
