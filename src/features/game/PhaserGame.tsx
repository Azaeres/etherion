import React from 'react';
import Phaser from 'phaser';
import moveCameraToScene from '../../util/moveCameraToScene';
import { selectCamera } from './gameState';
import { store } from '../../state/store';
import { Camera } from '../game/gameState';

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

    let camera: Camera | undefined;
    store.subscribe(() => {
      const lastCamera = camera;
      const state = store.getState();
      camera = selectCamera(state);
      moveCameraToScene.call(game, {
        fromCamera: lastCamera,
        toCamera: camera,
      });
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return <div id="phaser-game" />;
  }
}
