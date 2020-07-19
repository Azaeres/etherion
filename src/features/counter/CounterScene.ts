import { store } from '../../state/store';
import { Scene } from 'phaser';
import {
  decrement,
  increment,
  // incrementByAmount,
  incrementAsync,
  selectCount,
} from './counterState';

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

  create() {
    this.createFullscreenButton();
    this.createAddButton();
    this.createCountText();
    this.createAsyncButton();
    this.createSubtractButton();

    store.subscribe(this.stateDidUpdate);
  }

  createFullscreenButton() {
    // const supported = Phaser.Device.Fullscreen.available;
    // console.log('fullscreen > supported:', supported);
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
