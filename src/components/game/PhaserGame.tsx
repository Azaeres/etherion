import React from 'react';
import Phaser from 'phaser';

// 2000 / 1125
// const aspectRatio = 864 / 486;
// const pixelsWidth = window.innerWidth * window.devicePixelRatio;
// const pixelsHeight = window.innerHeight * window.devicePixelRatio;

export const GAME_WIDTH = 2000;
export const GAME_HEIGHT = 1125;

// export const { GAME_WIDTH, GAME_HEIGHT } = (() => {
//   const y = (486 * pixelsWidth) / 864;
//   if (y > pixelsHeight) {
//     // 864 / 486 = x / pixelsHeight;
//     const x = (pixelsHeight * 864) / 486;
//     return {
//       GAME_WIDTH: x,
//       GAME_HEIGHT: pixelsHeight,
//     };
//   } else {
//     // 864 / 486 = pixelsWidth / x;
//     return {
//       GAME_WIDTH: pixelsWidth,
//       GAME_HEIGHT: y,
//     };
//   }
// })();
// console.log(' > GAME_WIDTH:', GAME_WIDTH);
// console.log(' > GAME_HEIGHT:', GAME_HEIGHT);
// console.log(' > GAME_WIDTH / aspectRatio:', GAME_WIDTH / aspectRatio);

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
