import { Scene } from 'phaser';

import kairensTreeImage from '../../artwork/Kairens_tree.png';
import { store } from '../../state/store';
import { navigate } from '../game/gameState';
import TextButton from '../TextButton';
import NarrationText from '../NarrationText';
import createFadeIn from '../createFadeIn';

type SimpleSceneProps = { bar?: string; variant?: number };

const DEFAULT_MENU_ITEM_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  color: 'white',
  fontSize: '100px',
  fontFamily: 'OpenSansCondensed-Bold',
};

const TEXT_WHEN_PLAYING = 'Interrupt';
const TEXT_WHEN_STOPPED = 'Continue';
const TEXT_WHEN_READY = 'Next Scene';

export default class SimpleScene extends Scene {
  props: SimpleSceneProps = { variant: 0 };
  private _narrationText_variant0?: MultilineNarrationText;
  private _narrationText_variant1?: MultilineNarrationText;
  private _readyToContinue = false;
  private _playButtonInterface?: PlayButtonInterface;

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
      x: 690,
      y: 150,
      action: () =>
        store.dispatch(
          navigate({ sceneId: 'CounterScene', props: { foo: 'bar' } })
        ),
    });
    this.add.existing(swapSceneButton);

    this.createFadeIn(1600);

    this._narrationText_variant0 = this.createMultilineNarrationText({
      x: 100,
      y: this.sys.canvas.height - 200,
      text: `The quick brown fox
jumped over
the lazy brown dog.`,
    });
    this._narrationText_variant1 = this.createMultilineNarrationText({
      x: 100,
      y: this.sys.canvas.height - 200,
      text: `This is an example
of another
scene variant.`,
    });

    this._playButtonInterface = this.createPlayButton();
    console.log(' > playButtonInterface:', this._playButtonInterface);
    await this._playButtonInterface.start(1200);
    // playButtonInterface.playButton.text =
  }

  // Mixins
  createBackground = createBackground.bind(this);
  createNextSceneButton = createNextSceneButton.bind(this);
  createFadeIn = createFadeIn.bind(this);
  createMultilineNarrationText = createMultilineNarrationText.bind(this);

  async propsDidChange(nextProps: SimpleSceneProps) {
    console.log('propsDidChange  > nextProps:', nextProps);
    this.props = nextProps;
    console.log(' > this.props:', this.props);
    // console.log(' > this.propTextToggle:', this.propTextToggle);
    if (this.props.variant === 1) {
      this._narrationText_variant0?.stop();
      await this._narrationText_variant1?.start(100);
      this._readyToContinue = true;
      if (this._playButtonInterface) {
        this._playButtonInterface.playButton.text = TEXT_WHEN_READY;
      }
      console.log('propsDidChange READY TO CONTINUE  :');
    }
  }

  createPlayButton(): PlayButtonInterface {
    console.log('createPlayButton  :');
    const DEBUG = false;
    const onStop = () => {
      console.log('onStop  :');
      console.log(' > this.props.variant:', this.props.variant);
      if (this.props.variant === undefined || this.props.variant === 0) {
        playButton.text = TEXT_WHEN_STOPPED;
      } else if (this.props.variant === 1) {
        this._readyToContinue = true;
        playButton.text = TEXT_WHEN_READY;
        console.log('READY TO CONTINUE  :');
      }
    };
    const start = async (delay: number) => {
      console.log('Starting... > this.props:', this.props);
      if (this.props.variant === undefined || this.props.variant === 0) {
        console.log('starting variant 0  :');
        await this._narrationText_variant0?.start(delay);
        console.log('_narrationText_variant0 completed :');
        onStop();
      } else if (this.props.variant === 1) {
        console.log('starting variant 1  :');
        await this._narrationText_variant1?.start(delay);
        console.log('_narrationText_variant1 completed :');
        onStop();
      }
    };
    const playButton = new TextButton({
      scene: this,
      text: TEXT_WHEN_PLAYING,
      x: this.sys.canvas.width - 70,
      y: this.sys.canvas.height - 50,
      action: this._narrationText_variant0?.playButtonActionCreator({
        onStop,
        onContinue: async () => {
          console.log('onContinue  :');

          if (DEBUG) {
            // Hides all lines and replays.

            console.log('Hiding all lines and replaying... :');
            playButton.text = TEXT_WHEN_PLAYING;
            await this._narrationText_variant0?.start(100);
            onStop();
          } else {
            console.log('click > this.props:', this.props);
            if (this.props.variant === undefined || this.props.variant === 0) {
              console.log('navigating to variant 1...  :');
              console.log(' > this._readyToContinue:', this._readyToContinue);
              console.log(' > playButton.text:', playButton.text);
              this._readyToContinue = false;
              playButton.text = TEXT_WHEN_PLAYING;
              store.dispatch(
                navigate({
                  sceneId: 'SimpleScene',
                  props: { ...this.props, variant: 1 },
                })
              );
              // this._readyToContinue = true;
              playButton.text = this._readyToContinue
                ? TEXT_WHEN_READY
                : TEXT_WHEN_PLAYING;
            } else if (this.props.variant === 1) {
              console.log(
                'variant 1 > readyToContinue:',
                this._readyToContinue
              );
              if (this._readyToContinue) {
                this._readyToContinue = false;
                playButton.text = TEXT_WHEN_READY;
                await store.dispatch(
                  navigate({ sceneId: 'CounterScene', props: { foo: 'bar' } })
                );
              } else {
                console.log('completing variant 1...  :');
                this._narrationText_variant1?.complete();
                this._readyToContinue = true;
                playButton.text = TEXT_WHEN_READY;
                console.log('READY TO CONTINUE  :');
              }
            }
          }
        },
      }),
    });
    this.add.existing(playButton);
    return {
      playButton,
      start,
    };
  }
}

interface PlayButtonInterface {
  playButton: TextButton;
  start: (delay: number) => Promise<any>;
}

interface MultilineNarrationText {
  narrationTexts: NarrationText[];
  playButtonActionCreator: ({
    onStop,
    onContinue,
  }: {
    onStop: Function;
    onContinue: Function;
  }) => () => Promise<any>;
  start: (delay: number) => Promise<any>;
  stop: Function;
  complete: Function;
}

function createMultilineNarrationText(
  this: Scene,
  { x, y, text }: { x: number; y: number; text: string }
): MultilineNarrationText {
  const strings = text?.split('\n');
  const LINE_HEIGHT = 30;

  const narrationTexts = strings.map((text, index) => {
    const narrationText = new NarrationText({
      scene: this,
      x,
      y: y + index * LINE_HEIGHT,
      text,
    });
    this.add.existing(narrationText);
    return narrationText;
  });

  const DELAY_BETWEEN_LINES = 400;
  let isPlaying = false;
  const playButtonActionCreator = ({
    onStop,
    onContinue,
  }: {
    onStop?: Function;
    onContinue?: Function;
  }) => {
    return async () => {
      console.log('play button click  > isPlaying:', isPlaying);
      if (isPlaying) {
        // Interupt and complete the text.
        console.log('Interrupting and completing the text...  :');
        onStop && onStop();
        complete();
      } else {
        onContinue && (await onContinue());
      }
    };
  };

  const start = async (delay: number) => {
    isPlaying = true;
    narrationTexts?.forEach((narrationText) => narrationText.stop());
    if (narrationTexts) {
      for (let index = 0; index < narrationTexts.length; index++) {
        const element = narrationTexts[index];
        await element.fadeIn(index === 0 ? delay : DELAY_BETWEEN_LINES);
      }
    }
    isPlaying = false;
  };

  const stop = () => {
    isPlaying = false;
    narrationTexts?.forEach((narrationText) => {
      narrationText.stop();
    });
  };

  const complete = () => {
    isPlaying = false;
    narrationTexts?.forEach((narrationText) => {
      narrationText.complete();
    });
  };

  return {
    narrationTexts,
    playButtonActionCreator,
    start,
    stop,
    complete,
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
