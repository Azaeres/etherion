import React from 'react';
import Phaser from 'phaser';
import CounterScene from "../counter/CounterScene";

export const GAME_HEIGHT = 640;
export const GAME_WIDTH = 800;

export interface IGameProps {};

export default class PhaserGame extends React.Component<IGameProps, any> {
  componentDidMount() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: 'phaser-game',
      scene: [CounterScene]
    };

    new Phaser.Game(config);
  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return (<div id="phaser-game" />);
  }
}
