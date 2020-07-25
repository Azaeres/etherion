import { store } from '../../state/store';
import { Scene } from 'phaser';
import {
  decrement,
  increment,
  // incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterState';
// import logo from '../../logo.svg';
import testBackground from '../../test_background.jpg';
import etherionLogo from '../../etherion_logo-3.png';

const buttonStyle = {
  backgroundColor: 'white',
  color: 'blue',
  fontSize: 48,
};
const countTextStyle = {
  color: 'white',
  fontSize: 48,
};

export default class CounterScene extends Scene {
  countText?: Phaser.GameObjects.Text;
  logo?: any;
  etherionLogo: any;
  // logoRate: number;
  // logoAlphaRate: number;

  constructor() {
    super('Logo Scene');
    // this.logoRate = 1;
    // this.logoAlphaRate = 1;
  }

  preload() {
    // console.log('preload :');
    // this.load.image('logo', logo);
    this.load.image('background', testBackground);
    this.load.image('etherionLogo', etherionLogo);
  }

  create() {
    // console.log('create  > this:', this);
    // this.createBackground();
    // this.createFullscreenButton();
    // this.createAddButton();
    // this.createCountText();
    // this.createAsyncButton();
    // this.createSubtractButton();
    // this.createLogoImage();
    this.createEtherionLogo();
    // this.createLogoImage();

    store.subscribe(this.stateDidUpdate);
  }

  createEtherionLogo() {
    // this.logoAlphaRate = 1;
    // this.logoRate = 1;
    this.etherionLogo = this.add.sprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 - 20,
      'etherionLogo'
    );

    this.etherionLogo.setScale(0.6);
    this.etherionLogo.setOrigin(0.5, 0.42);
    this.etherionLogo.alpha = 0.0;

    this.tweens.add({
      targets: this.etherionLogo,
      scale: { from: 0.6, to: 1 },
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      delay: 100,
      duration: 6000,
      repeat: 0,
      yoyo: false,
      onComplete: () => {
        this.createBackground();

        this.tweens.add({
          targets: this.etherionLogo,
          alpha: { from: 1, to: 0 },
          ease: 'Linear',
          delay: 0,
          duration: 100,
          repeat: 0,
          yoyo: false,
        });

        this.tweens.add({
          targets: this.etherionLogo,
          scale: { from: 1, to: 10 },
          ease: 'Linear',
          delay: 0,
          duration: 1000,
          repeat: 0,
          yoyo: false,
          onComplete: () => {
            this.etherionLogo.destroy();
            this.etherionLogo = null;
          },
        });
      },
    });
  }

  createBackground() {
    const bg = this.add.image(0, 0, 'background');
    bg.alpha = 0;
    bg.setOrigin(0, 0);
    bg.displayWidth = this.sys.canvas.width;
    bg.displayHeight = this.sys.canvas.height;

    this.tweens.add({
      targets: bg,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      delay: 800,
      duration: 2000,
      repeat: 0,
      yoyo: false,
      onComplete: () => {
        this.createFullscreenButton();
        this.createAddButton();
        this.createCountText();
        this.createAsyncButton();
        this.createSubtractButton();
        this.createLogoImage();
      },
    });
  }

  createLogoImage() {
    this.logo = this.add.sprite(250, 250, 'etherionLogo');
    this.logo.setOrigin(0.5, 0.42);
    this.tweens.add({
      targets: this.logo,
      angle: { from: 0, to: 360 },
      ease: 'Linear',
      // delay: 800,
      duration: 700,
      repeat: -1,
      yoyo: false,
    });
  }

  createFullscreenButton() {
    this.scale.on('fullscreenunsupported', (...args: any) => {
      this.add.text(400, 100, 'fullscreen is unsupported!');
    });

    const fullscreenButton = this.add.text(10, 10, 'Fullscreen', buttonStyle);
    fullscreenButton.setInteractive({ useHandCursor: true });
    fullscreenButton.on('pointerup', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
        // On stop fulll screen
      } else {
        this.scale.startFullscreen();
        // On start fulll screen
      }
    });
  }

  createSubtractButton() {
    const addButton = this.add.text(550, 250, '-', buttonStyle);
    addButton.setInteractive({ useHandCursor: true });
    addButton.on('pointerup', this.onSub);
  }

  createAsyncButton() {
    const addAsyncButton = this.add.text(285, 250, 'Add Async', buttonStyle);
    addAsyncButton.setInteractive({ useHandCursor: true });
    addAsyncButton.on('pointerup', this.onIncrementAsync);
  }

  createCountText() {
    const state = store.getState();
    const count = selectCount(state);
    this.countText = this.add.text(380, 180, String(count), countTextStyle);
  }

  createAddButton() {
    const addButton = this.add.text(250, 250, '+', buttonStyle);
    addButton.setInteractive({ useHandCursor: true });
    addButton.on('pointerup', this.onAdd);
  }

  /**
   * stateDidUpdate
   */
  stateDidUpdate = () => {
    const state = store.getState();
    const count = selectCount(state);
    this.countText && this.countText.setText(String(count));
  };

  onAdd = () => {
    const action = increment();
    store.dispatch(action);
  };

  onSub = () => {
    const action = decrement();
    store.dispatch(action);
  };

  onIncrementAsync = () => {
    incrementAsync(1)(store.dispatch, store.getState, undefined);
  };
}
