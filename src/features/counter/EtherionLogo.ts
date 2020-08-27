import { Scene } from 'phaser';
import etherionLogo from '../../etherion_logo-3.png';

export function preloadEtherionLogo(this: Scene) {
  this.load.image('EtherionLogo_etherionLogo', etherionLogo);
}

export default async function createEtherionLogo(this: Scene) {
  return new Promise((resolve, reject) => {
    const etherionLogo = this.add.sprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 - 20,
      'EtherionLogo_etherionLogo'
    );

    etherionLogo.setScale(0.4);
    etherionLogo.setOrigin(0.5, 0.42);
    etherionLogo.alpha = 0.0;

    this.tweens.add({
      targets: etherionLogo,
      scale: { from: 0.4, to: 0.6 },
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      delay: 100,
      duration: 6000,
      repeat: 0,
      yoyo: false,
      onComplete: () => {
        resolve();
        this.tweens.add({
          targets: etherionLogo,
          alpha: { from: 1, to: 0 },
          scale: { from: 0.6, to: 1 },
          ease: 'Linear',
          delay: 0,
          duration: 200,
          repeat: 0,
          yoyo: false,
        });
      },
    });
  });
}
