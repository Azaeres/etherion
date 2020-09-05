import React from 'react';
import Phaser from 'phaser';
import SimpleScene from '../scenes/SimpleScene';

export const GAME_WIDTH = 864;
export const GAME_HEIGHT = 486;

export interface IGameProps {}

export default class PhaserGame extends React.Component<IGameProps, any> {
  componentDidMount() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: 'phaser-game',
      scene: SimpleScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    new Phaser.Game(config);
  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return <div id="phaser-game" />;
  }
}
