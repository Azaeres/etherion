import Phaser, { Scene } from 'phaser';

const DEFAULT_STYLE = {
  color: 'white',
  fontSize: '12px',
  fontFamily: 'Oswald-ExtraLight',
};

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
  }
}
