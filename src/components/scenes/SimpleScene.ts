import { Scene } from 'phaser';

import kairensTreeImage from '../../artwork/Kairens_tree.png';
import { store } from '../../state/store';
import { navigate } from '../game/gameState';
import TextButton from '../TextButton';
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
    this.createBackground();
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

    this.createFadeIn(1600);

    const narrationTextInterface = this.createMultilineNarrationText({
      x: 100,
      y: this.sys.canvas.height - 200,
      text: `The quick brown fox
jumped over
the lazy brown dog.`,
    });

    const TEXT_STOP = 'Stop';
    const TEXT_PLAY = 'Play';
    const onStop = () => {
      console.log('onStop  :');
      playButton.text = TEXT_PLAY;
    };
    const playButton = new TextButton({
      scene: this,
      text: TEXT_STOP,
      x: this.sys.canvas.width - 70,
      y: this.sys.canvas.height - 50,
      action: narrationTextInterface.playButtonActionCreator({
        onStart: () => {
          console.log('onStart  :');
          playButton.text = TEXT_STOP;
        },
        onStop,
      }),
    });
    this.add.existing(playButton);

    await narrationTextInterface.start(1400);
    onStop();
  }

  // Mixins
  createBackground = createBackground.bind(this);
  createNextSceneButton = createNextSceneButton.bind(this);
  createFadeIn = createFadeIn.bind(this);
  createMultilineNarrationText = createMultilineNarrationText.bind(this);
}

function createMultilineNarrationText(
  this: Scene,
  { x, y, text }: { x: number; y: number; text?: string }
) {
  console.log('createMultilineNarrationText > text:', text);
  const strings = text?.split('\n');
  console.log(' > strings:', strings);
  const LINE_HEIGHT = 30;

  // : this.sys.canvas.height - 200
  const narrationTexts = strings?.map((text, index) => {
    const narrationText = new NarrationText({
      scene: this,
      x,
      y: y + index * LINE_HEIGHT,
      text,
    });
    this.add.existing(narrationText);
    return narrationText;
  });

  const START_DELAY = 100;
  const DELAY_BETWEEN_LINES = 400;
  let isPlaying = false;
  const playButtonActionCreator = ({
    onStart,
    onStop,
  }: {
    onStart?: Function;
    onStop?: Function;
  }) => {
    console.log(' > this.tweens:', this.tweens);
    return async () => {
      console.log('play button click  > isPlaying:', isPlaying);
      if (isPlaying) {
        // Interupt and complete the text.
        isPlaying = false;
        onStop && onStop();
        narrationTexts?.forEach((narrationText) => {
          narrationText.complete();
        });
      } else {
        // TODO: Change this to be a Continue event. Replay is for testing.
        // Hides all lines and replays.
        isPlaying = true;
        onStart && onStart();
        narrationTexts?.forEach((narrationText) => narrationText.stop());

        if (narrationTexts) {
          for (let index = 0; index < narrationTexts.length; index++) {
            const element = narrationTexts[index];
            await element.fadeIn(
              index === 0 ? START_DELAY : DELAY_BETWEEN_LINES
            );
          }
        }
        isPlaying = false;
        onStop && onStop();
      }

      console.log('fadeIn done  :');
    };
  };

  const start = async (delay: number) => {
    isPlaying = true;
    if (narrationTexts) {
      for (let index = 0; index < narrationTexts.length; index++) {
        const element = narrationTexts[index];
        await element.fadeIn(index === 0 ? delay : DELAY_BETWEEN_LINES);
      }
    }
    isPlaying = false;
    console.log('fadeIn done  :');
  };

  return {
    narrationTexts,
    playButtonActionCreator,
    start,
  };
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
