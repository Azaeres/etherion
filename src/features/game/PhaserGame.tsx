import React from 'react';
import Phaser from 'phaser';
// import { Camera } from './gameState';
// import { RootState } from '../../state/store';
// import { connect } from 'react-redux';

export const GAME_WIDTH = 864;
export const GAME_HEIGHT = 486;

export interface IGameProps {
  // camera: Camera;
}

// type PhaserGameState = {
//   game?: Phaser.Game;
// };

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'phaser-game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export const game = new Phaser.Game(config);

export default class PhaserGame extends React.Component<IGameProps, any> {
  shouldComponentUpdate() {
    return false;
  }

  public render() {
    return <div id="phaser-game" />;
  }
}

// const mapStateToProps = (state: RootState) => ({
//   camera: state.game.camera,
// });

// export default connect(mapStateToProps)(PhaserGame);
