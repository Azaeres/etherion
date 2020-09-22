import { Scene } from 'phaser';

import kairensTreeImage from '../../artwork/Kairens_tree.png';
import { store } from '../../state/store';
import { navigate } from '../game/gameState';
import TextButton from '../TextButton';
import createFadeIn from '../createFadeIn';
import MultilineNarrationText from '../MultilineNarrationText';
import NarrationTextButton from '../NarrationTextButton';

type SimpleSceneProps = { bar?: string; variant?: number };

const DEFAULT_MENU_ITEM_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  color: 'white',
  fontSize: '100px',
  fontFamily: 'OpenSansCondensed-Bold',
};

export default class SimpleScene extends Scene {
  props: SimpleSceneProps = { variant: 0 };
  private _narrationTextButton?: NarrationTextButton;

  init(data: SimpleSceneProps) {
    console.log('SimpleScene init - data:', data);
    this.props = data;
  }

  preload() {
    this.load.image('kairens-tree', kairensTreeImage);
  }

  async create() {
    this.createBackground();
    const swapSceneButton = new TextButton({
      scene: this,
      text: 'Next Scene',
      x: this.sys.canvas.width - 490,
      y: 450,
      action: () =>
        store.dispatch(
          navigate({ sceneId: 'CounterScene', props: { foo: 'bar' } })
        ),
    });
    this.add.existing(swapSceneButton);

    this.createFadeIn(1600);

    console.log(' > this.props.variant:', this.props.variant);
    this._narrationTextButton = new NarrationTextButton({
      scene: this,
      x: this.sys.canvas.width - 140,
      y: this.sys.canvas.height - 150,
      buttonStates: {
        START: 'Start',
        PLAYING: 'Interrupt',
        PAUSED: 'Continue',
        DONE: 'Next Scene',
      },
      // disabled: false,
      // startIndex: this.props.variant,
      onItemStart: (indexStarted) => {
        console.log('onItemStart  > indexStarted:', indexStarted);
        if (indexStarted !== this.props.variant) {
          store.dispatch(
            navigate({
              sceneId: 'SimpleScene',
              props: { ...this.props, variant: indexStarted },
            })
          );
        }
      },
      // onItemComplete: (indexCompleted) => {
      //   console.log('onItemComplete  > indexCompleted:', indexCompleted);
      // },
      onComplete: () => {
        console.log('NarrationTextButton action  :');
        store.dispatch(
          navigate({ sceneId: 'CounterScene', props: { foo: 'bar' } })
        );
      },
      narrationTextSeries: [
        new MultilineNarrationText({
          scene: this,
          x: 240,
          y: this.sys.canvas.height - 400,
          text: `The quick brown fox
jumped over
the lazy brown dog.`,
        }),
        new MultilineNarrationText({
          scene: this,
          x: 320,
          y: this.sys.canvas.height - 300,
          text: `This is an example
of another
scene variant.`,
        }),
      ],
    });
    this.add.existing(this._narrationTextButton);
    this._narrationTextButton.start(this.props.variant);
  }

  // Mixins
  createBackground = createBackground.bind(this);
  createNextSceneButton = createNextSceneButton.bind(this);
  createFadeIn = createFadeIn.bind(this);
}

interface PlayButtonInterface {
  playButton: TextButton;
  start: (delay: number) => Promise<any>;
}

function createNextSceneButton(
  this: Scene,
  {
    x = this.sys.canvas.width - 250,
    y = 650,
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
  const bg = this.add.image(0, -70, 'kairens-tree');
  bg.setOrigin(0, 0);
  bg.scale = 0.9;

  return bg;
}
