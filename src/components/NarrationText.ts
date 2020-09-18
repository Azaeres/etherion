import Phaser, { Scene } from 'phaser';

const DEFAULT_STYLE = {
  color: 'white',
  fontSize: '18px',
  fontFamily: 'Oswald-Light',
};

const SLIDE_IN = 24;

export default class NarrationText extends Phaser.GameObjects.Text {
  private _originY: number;

  constructor({
    scene,
    x,
    y,
    text,
    style = DEFAULT_STYLE,
  }: {
    scene: Scene;
    x: number;
    y: number;
    text: string | string[];
    style?: object;
  }) {
    super(scene, x, y, text, style);
    this._originY = y;
    this.alpha = 0;
    this.setShadow(0, 1, '#333', 2, false, true);
  }

  public hide() {
    this.alpha = 0;
  }

  public async fadeIn(delay: number) {
    this.alpha = 0;
    this.y = this._originY - SLIDE_IN;
    const alphaTweenPromise = new Promise((resolve, reject) => {
      this.scene.tweens.add({
        targets: [this],
        alpha: { from: 0, to: 1 },
        ease: 'Linear',
        delay: delay + 80,
        duration: 360,
        onComplete: (...args) => {
          console.log('alpha tween onComplete  > args:', args);
          resolve();
        },
      });
    });
    const positionTweenPromise = new Promise((resolve, reject) => {
      this.scene.tweens.add({
        targets: [this],
        y: this.y + SLIDE_IN,
        ease: 'Quad.easeOut',
        delay: delay,
        duration: 300,
        onComplete: (...args) => {
          console.log('position tween onComplete  > args:', args);
          resolve();
        },
      });
    });
    return Promise.all([alphaTweenPromise, positionTweenPromise]);
  }
}
