import React from 'react';
import Phaser from 'phaser';
import moveCameraToScene from '../../util/moveCameraToScene';
import { selectCurrentScene } from './gameState';
import { store } from '../../state/store';
import { SceneIds } from '../scenes';

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

    let sceneId: SceneIds | void;
    store.subscribe(() => {
      const lastSceneId = sceneId;
      const state = store.getState();
      sceneId = selectCurrentScene(state);
      moveCameraToScene.call(game, {
        fromSceneId: lastSceneId,
        toSceneId: sceneId,
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
