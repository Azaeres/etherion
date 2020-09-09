import { Scene } from 'phaser';
import etherionLogo from '../../etherion_logo-3.png';
import { store } from '../../state/store';
import { navigate } from '../game/gameState';

export function preloadLogoImage(this: Scene) {
  this.load.image('LogoImage_etherionLogo', etherionLogo);
}

export default function createLogoImage(this: Scene) {
  const logo = this.add.sprite(
    this.sys.canvas.width - 150,
    150,
    'LogoImage_etherionLogo'
  );
  logo.setOrigin(0.5, 0.42);
  logo.setInteractive({ useHandCursor: true });
  logo.on('pointerup', () => {
    console.log('click logo  :');
    store.dispatch(navigate({ scene: 'LogoScene' }));
  });
  this.tweens.add({
    targets: logo,
    angle: { from: 360, to: 0 },
    ease: 'Linear',
    // delay: 800,
    duration: 2700,
    repeat: -1,
    yoyo: false,
  });
}
