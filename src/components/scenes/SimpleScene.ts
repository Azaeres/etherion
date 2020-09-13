import { Scene } from 'phaser';

import kairensTreeImage from '../../artwork/Kairens_tree.png';
import { store } from '../../state/store';
import { navigate } from '../game/gameState';
import TextButton, { fonts as textButtonFonts } from '../TextButton';
import NarrationText from '../NarrationText';
import createFadeIn from '../createFadeIn';

const DEFAULT_MENU_ITEM_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  color: 'white',
  fontSize: '100px',
  fontFamily: 'OpenSansCondensed-Bold',
};

export default class SimpleScene extends Scene {
  init(data: { bar: string }) {
    console.log('SimpleScene init - data:', data);
  }

  preload() {
    this.load.image('kairens-tree', kairensTreeImage);
  }

  async create() {
    const bg = this.createBackground();
    const swapSceneButton = new TextButton({
      scene: this,
      text: 'Next Scene',
      x: 690,
      y: 150,
      action: () =>
        store.dispatch(
          navigate({ sceneId: 'CounterScene', props: { foo: 'bar' } })
        ),
    });
    this.add.existing(swapSceneButton);

    const narrationText = new NarrationText({
      scene: this,
      x: 100,
      y: this.sys.canvas.height - 100,
      text: 'The quick brown fox jumped over the lazy dog.',
    });
    this.add.existing(narrationText);

    this.createFadeIn(1600);
  }

  // Mixins
  createBackground = createBackground.bind(this);
  createNextSceneButton = createNextSceneButton.bind(this);
  createFadeIn = createFadeIn.bind(this);
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
  // bg.alpha = 0;
  bg.setOrigin(0, 0);
  bg.scale = 0.4;
  bg.x = 0;
  bg.y = -70;

  return bg;
}
