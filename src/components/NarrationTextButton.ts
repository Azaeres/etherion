import TextButton from './TextButton';
import Phaser, { Scene } from 'phaser';
import MultilineNarrationText from './MultilineNarrationText';

type ButtonStates = 'START' | 'PLAYING' | 'PAUSED' | 'DONE';

interface NarrationTextButtonStates {
  START: string;
  PLAYING: string;
  PAUSED: string;
  DONE: string;
}

export default class NarrationTextButton extends TextButton {
  private _onComplete: Function;
  private _onItemComplete: (indexCompleted: number) => void;
  private _onItemStart: (indexStarted: number) => void;
  private _narrationTextSeries: MultilineNarrationText[];
  protected _state: ButtonStates;
  protected _currentIndex: number = -1;
  private _buttonStates: NarrationTextButtonStates;
  private _onClick: Function;

  constructor({
    scene,
    x,
    y,
    buttonStates,
    style,
    disabled = false,
    onComplete = () => {},
    narrationTextSeries,
    onItemComplete = () => {},
    onItemStart = () => {},
    startIndex = 0,
  }: {
    scene: Scene;
    x: number;
    y: number;
    buttonStates: NarrationTextButtonStates;
    style?: Phaser.Types.GameObjects.Text.TextStyle;
    disabled?: boolean;
    onComplete?: Function;
    onItemComplete?: (indexCompleted: number) => void;
    onItemStart?: (indexStarted: number) => void;
    narrationTextSeries: MultilineNarrationText[];
    startIndex?: number;
  }) {
    super({
      scene,
      x,
      y,
      text: buttonStates.START,
      style,
      disabled,
      action: async () => {
        console.log('NarrationTextButton start :');
        console.log(' > startIndex:', startIndex);
        await this._onClick(startIndex);
        console.log('NarrationTextButton series done  :');
      },
    });
    this._state = 'START';
    this._onComplete = onComplete;
    this._narrationTextSeries = narrationTextSeries;
    this._buttonStates = buttonStates;
    this._onClick = this.start;
    this._onItemComplete = onItemComplete;
    this._onItemStart = onItemStart;
  }

  public async start(index: number = 0) {
    console.trace('NarrationTextButton start > index:', index);
    const priorIndex = this._currentIndex;
    this._currentIndex = index;

    // When playing, the click action is an interrupt.
    this.text = this._buttonStates.PLAYING;
    this._onClick = () => {
      this.lineCompleted();
    };

    // Clears the prior item.
    const priorItem: MultilineNarrationText = this._narrationTextSeries[
      priorIndex
    ];
    priorItem?.stop();

    this._onItemStart(this._currentIndex);

    // Start the animation.
    const multilineNarrationText: MultilineNarrationText = this
      ._narrationTextSeries[this._currentIndex];
    await multilineNarrationText.start(1200);

    // When done playing, advance to the next state.
    console.log('start ended  :');
    this.lineCompleted();
  }

  public lineCompleted() {
    console.log('NarrationTextButton lineCompleted :');

    // Interrupt any animation and advance it to its end state.
    const multilineNarrationText: MultilineNarrationText = this
      ._narrationTextSeries[this._currentIndex];
    multilineNarrationText.complete();
    this._onItemComplete(this._currentIndex);

    const nextIndex = this._currentIndex + 1;
    const nextItem = this._narrationTextSeries[nextIndex];
    if (nextItem === undefined) {
      // If there's no next item, we're done.
      this.text = this._buttonStates.DONE;
      this._onClick = this._onComplete;
    } else {
      // Set up the click action to start the next item.
      this.text = this._buttonStates.PAUSED;
      this._onClick = async () => {
        console.log('continue  :');
        await this.start(nextIndex);
      };
    }
  }
}
