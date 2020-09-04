import React from 'react';
import PhaserGame from './features/game/PhaserGame';
import './App.css';
import './fonts.css';
import { version } from '../package.json';
import './control';

console.info(`Etherion v${version}`);

export default function App(props: any) {
  return (
    <div className="App">
      <PhaserGame />
    </div>
  );
}
