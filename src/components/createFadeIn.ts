import { Scene } from 'phaser';

export default function createFadeIn(this: Scene, duration: number) {
  var fg = this.add.rectangle(
    0,
    0,
    this.sys.canvas.width,
    this.sys.canvas.height,
    0x000000
  );
  fg.setOrigin(0, 0);
  this.tweens.add({
    targets: [fg],
    alpha: { from: 1, to: 0 },
    ease: 'Linear',
    delay: 0,
    duration,
    repeat: 0,
    yoyo: false,
  });
  return fg;
}
