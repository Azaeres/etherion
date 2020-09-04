import React from 'react';
import Phaser from 'phaser';
import SimpleScene from '../scenes/simple-scene';
import CounterScene from '../counter/CounterScene';
// import CounterScene from '../counter/CounterScene';

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
      // scene: SimpleScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    game.scene.add('menuScene', SimpleScene, true);
    game.scene.add('counterScene', CounterScene, false);
  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return <div id="phaser-game" />;
  }
}
