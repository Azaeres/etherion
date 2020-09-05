import { Scene } from 'phaser';

import kairensTreeImage from '../../artwork/Kairens_tree.png';
import preloadFonts from '../../util/preloadFonts';
import { store } from '../../state/store';
import { navigate } from '../game/gameState';
// import moveCameraToScene from '../../util/moveCameraToScene';

const DEFAULT_MENU_ITEM_STYLE = {
  color: 'white',
  fontSize: 32,
  fontFamily: 'OpenSansCondensed-Bold',
};

export default class SimpleScene extends Scene {
  preload() {
    this.load.image('kairens-tree', kairensTreeImage);
    this.preloadFonts(['OpenSansCondensed-Bold']);
  }

  async create() {
    const bg = this.createBackground();
    const swapSceneButton = this.createNextSceneButton({
      x: 630,
      y: 150,
      onPointerUp: () => store.dispatch(navigate('CounterScene')),
    });

    this.tweens.add({
      targets: [bg, swapSceneButton],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      delay: 0,
      duration: 1600,
      repeat: 0,
      yoyo: false,
    });
  }

  // Mixins
  preloadFonts = preloadFonts.bind(this);
  // moveCameraToScene = moveCameraToScene.bind(this);

  createBackground = createBackground.bind(this);
  createNextSceneButton = createNextSceneButton.bind(this);
}

function createNextSceneButton(
  this: Scene,
  {
    x = 250,
    y = 250,
    onPointerUp = () => {},
    buttonStyle = DEFAULT_MENU_ITEM_STYLE,
  }: { x?: number; y?: number; onPointerUp?: () => void; buttonStyle?: object }
) {
  const swapSceneButton = this.add.text(x, y, 'Next Scene', buttonStyle);
  swapSceneButton.alpha = 0;
  swapSceneButton.setInteractive({ useHandCursor: true });
  swapSceneButton.on('pointerup', onPointerUp);

  return swapSceneButton;
}

function createBackground(this: Scene) {
  const bg = this.add.image(0, 0, 'kairens-tree');
  bg.alpha = 0;
  bg.setOrigin(0, 0);
  bg.scale = 0.4;
  bg.x = 0;
  bg.y = -70;

  return bg;
}