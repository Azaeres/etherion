import { Scene } from 'phaser';
import NarrationText from './NarrationText';

const LINE_HEIGHT = 48;
const DELAY_BETWEEN_LINES = 400;

export default class MultilineNarrationText {
  private _scene: Scene;
  private _x: number;
  private _y: number;
  private _lineHeight: number;
  private _isPlaying: boolean = false;
  private _narrationTexts: NarrationText[];
  private _delayBetweenLines: number;

  constructor({
    scene,
    x,
    y,
    text,
    lineHeight,
    delayBetweenLines,
  }: {
    scene: Scene;
    x: number;
    y: number;
    text: string | string[];
    lineHeight?: number;
    delayBetweenLines?: number;
  }) {
    this._scene = scene;
    this._x = x;
    this._y = y;
    this._lineHeight = lineHeight === undefined ? LINE_HEIGHT : lineHeight;
    this._delayBetweenLines =
      delayBetweenLines === undefined ? DELAY_BETWEEN_LINES : delayBetweenLines;
    this._narrationTexts = this.stringArrayToNarrationTexts(text);
  }

  protected stringArrayToNarrationTexts(
    text: string | string[]
  ): NarrationText[] {
    const strings: string[] = (() => {
      if (Array.isArray(text)) {
        return text;
      } else if (typeof text === 'string') {
        return text.split('\n');
      } else {
        return [];
      }
    })();
    return strings.map((text, index) => {
      const narrationText = new NarrationText({
        scene: this._scene,
        x: this._x,
        y: this._y + index * this._lineHeight,
        text,
      });
      this._scene.add.existing(narrationText);
      return narrationText;
    });
  }

  public playButtonActionCreator({
    onStop,
    onContinue,
  }: {
    onStop: Function;
    onContinue: Function;
  }): () => Promise<any> {
    return async () => {
      console.log('play button click  > this._isPlaying:', this._isPlaying);
      if (this._isPlaying) {
        // Interupt and complete the text.
        console.log('Interrupting and completing the text...  :');
        onStop && onStop();
        this.complete();
      } else {
        onContinue && (await onContinue());
      }
    };
  }

  public complete() {
    this._isPlaying = false;
    this._narrationTexts?.forEach((narrationText) => {
      narrationText.complete();
    });
  }

  public async start(delay: number) {
    return new Promise(async (resolve) => {
      this._isPlaying = true;
      this._narrationTexts?.forEach((narrationText) => narrationText.stop());
      if (this._narrationTexts) {
        for (let index = 0; index < this._narrationTexts.length; index++) {
          const element = this._narrationTexts[index];
          await element.fadeIn(index === 0 ? delay : this._delayBetweenLines);
        }
      }
      resolve();
      this._isPlaying = false;
    });
  }

  public stop() {
    this._isPlaying = false;
    this._narrationTexts?.forEach((narrationText) => {
      narrationText.stop();
    });
  }
}
