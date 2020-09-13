import Phaser, { Scene } from 'phaser';

const DEFAULT_STYLE = {
  color: 'white',
  fontSize: '18px',
  fontFamily: 'Oswald-Light',
};

const SLIDE_IN = 12;

export default class NarrationText extends Phaser.GameObjects.Text {
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
    // this.alpha = 0;
    this.setShadow(0, 1, '#333', 2, false, true);
  }

  public fadeIn(delay: number) {
    this.alpha = 0;
    this.y = this.y - SLIDE_IN;
    this.scene.tweens.add({
      targets: [this],
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      delay: delay + 80,
      duration: 360,
    });
    this.scene.tweens.add({
      targets: [this],
      y: this.y + SLIDE_IN,
      ease: 'Quad.easeOut',
      delay: delay,
      duration: 600,
    });
  }
}
