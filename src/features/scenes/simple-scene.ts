import { store } from '../../state/store';
import { Scene } from 'phaser';
// import { decrement, increment, incrementAsync } from './counterState';

import kairensTreeImage from '../../artwork/Kairens_tree.png';
import preloadFonts from '../../util/preloadFonts';
import CounterScene from '../counter/CounterScene';
// import createCountText, { countTextFonts } from './CountText';
// import createLogoImage, { preloadLogoImage } from './LogoImage';
// import createEtherionLogo, { preloadEtherionLogo } from './EtherionLogo';
// import { selectNeedsUpdate } from '../../appState';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in pellentesque purus. Nam eu finibus nibh. Ut porttitor vehicula tortor, id convallis orci porta sed. Pellentesque turpis tortor, faucibus eu placerat eu, tempor id nibh. Donec sollicitudin sem nunc, eu commodo velit maximus vitae. Aliquam eleifend ex sit amet tortor suscipit tempus. Nullam venenatis porta rhoncus. Ut malesuada magna non mauris tincidunt commodo.`;

const DEFAULT_MENU_ITEM_STYLE = {
  // backgroundColor: 'white',
  color: 'white',
  fontSize: 32,
  fontFamily: 'OpenSansCondensed-Bold',
  // fontStyle: 'bold',
  // fontWeight: 700,
  // padding: {
  //   left: 6,
  //   right: 6,
  //   top: 6,
  //   bottom: 6,
  // },
};

export default class SimpleScene extends Scene {
  preload() {
    this.load.image('kairens-tree', kairensTreeImage);

    // this.preloadEtherionLogo();
    // this.preloadLogoImage();
    this.preloadFonts(new Set(['OpenSansCondensed-Bold']));
    console.log(' > this.scene:', this.scene);

    // this.scene.add('counterScene', CounterScene, false);
  }

  async create() {
    // await this.createEtherionLogo();
    this.createBackground();
    // this.createGraphicsBackground();
    // this.createFullscreenButton({ text: 'FS----' });
    // this.createSubtractButton({ onPointerUp: this.onSub });
    // this.createAsyncButton({ onPointerUp: this.onIncrementAsync });
    // this.createCountText({ x: 100, y: 200 });
    // this.createCountText({ x: 200, y: 200 });
    this.createNextSceneButton({
      x: 630,
      y: 150,
      onPointerUp: this.swapScenes,
    });
    // this.createAddButton({ x: 40, y: 400, onPointerUp: this.onAdd });
    // this.createLogoImage();
    // this.createNeedsUpdateNotification();
  }

  // Event handlers

  swapScenes = () => {
    console.log('Swap!  :');
    this.scene.stop();
    this.scene.start('counterScene');
  };

  // onAdd = () => {
  //   const action = increment();
  //   store.dispatch(action);
  // };

  // onSub = () => {
  //   const action = decrement();
  //   store.dispatch(action);
  // };

  // onIncrementAsync = () => {
  //   incrementAsync(1)(store.dispatch, store.getState, undefined);
  // };

  // Mixins
  preloadFonts = preloadFonts.bind(this);
  // preloadLogoImage = preloadLogoImage.bind(this);
  // preloadEtherionLogo = preloadEtherionLogo.bind(this);

  // createEtherionLogo = createEtherionLogo.bind(this);
  createBackground = createBackground.bind(this);
  // createLogoImage = createLogoImage.bind(this);
  // createGraphicsBackground = createGraphicsBackground.bind(this);
  // createFullscreenButton = createFullscreenButton.bind(this);
  // createSubtractButton = createSubtractButton.bind(this);
  // createAsyncButton = createAsyncButton.bind(this);
  // createCountText = createCountText.bind(this);
  // createAddButton = createAddButton.bind(this);
  // createNeedsUpdateNotification = createNeedsUpdateNotification.bind(this);
  createNextSceneButton = createNextSceneButton.bind(this);
}

// function createNeedsUpdateNotification(this: Scene) {
//   const state = store.getState();
//   const needsUpdate = selectNeedsUpdate(state);
//   const alpha = needsUpdate ? 1 : 0;

//   const needsUpdateNotificationText = this.add.text(
//     600,
//     10,
//     'Update is available!',
//     {
//       fontSize: 14,
//       fontFamily: 'OpenSansCondensed-Bold',
//     }
//   );
//   needsUpdateNotificationText.alpha = alpha;
//   console.log(' > needsUpdateNotificationText:', needsUpdateNotificationText);

//   const unsubscribe = store.subscribe(() => {
//     const state = store.getState();
//     const nowNeedsUpdate = selectNeedsUpdate(state);
//     needsUpdateNotificationText.alpha = nowNeedsUpdate ? 1 : 0;
//   });
//   needsUpdateNotificationText.on('destroy', () => {
//     unsubscribe();
//   });
//   // setTimeout(() => {
//   //   const action = markIsUpdated();
//   //   store.dispatch(action);
//   // }, 2000);
// }

function createNextSceneButton(
  this: Scene,
  {
    x = 250,
    y = 250,
    onPointerUp = () => {},
    buttonStyle = DEFAULT_MENU_ITEM_STYLE,
  }: { x?: number; y?: number; onPointerUp?: () => void; buttonStyle?: object }
) {
  const swapSceneButton = this.add.text(x, y, 'Next Scene', buttonStyle);
  swapSceneButton.alpha = 0;
  swapSceneButton.setInteractive({ useHandCursor: true });
  swapSceneButton.on('pointerup', onPointerUp);

  this.tweens.add({
    targets: swapSceneButton,
    alpha: { from: 0, to: 1 },
    ease: 'Linear',
    delay: 0,
    duration: 1600,
    repeat: 0,
    yoyo: false,
  });
}

// function createAsyncButton(
//   this: Scene,
//   { onPointerUp = () => {} }: { onPointerUp: () => void }
// ) {
//   const addAsyncButton = this.add.text(
//     285,
//     250,
//     'Add Async',
//     DEFAULT_BUTTON_STYLE
//   );
//   addAsyncButton.setInteractive({ useHandCursor: true });
//   addAsyncButton.on('pointerup', onPointerUp);
//   addAsyncButton.setShadow(0, 4, '#333', 6, false, true);
// }

// function createSubtractButton(
//   this: Scene,
//   { onPointerUp = () => {} }: { onPointerUp: () => void }
// ) {
//   const addButton = this.add.text(550, 250, '-', DEFAULT_BUTTON_STYLE);
//   addButton.setInteractive({ useHandCursor: true });
//   addButton.on('pointerup', onPointerUp);
// }

// function createFullscreenButton(
//   this: Scene,
//   {
//     x = 400,
//     y = 10,
//     text = 'Fullscreen',
//     style = DEFAULT_BUTTON_STYLE,
//   }: {
//     x?: number;
//     y?: number;
//     text?: string | string[];
//     style?: object;
//   } = {}
// ) {
//   this.scale.on('fullscreenunsupported', (...args: any) => {
//     this.add.text(400, 100, 'fullscreen is unsupported!');
//   });

//   const fullscreenButton = this.add.text(x, y, text, style);
//   fullscreenButton.setInteractive({ useHandCursor: true });
//   fullscreenButton.on('pointerup', () => {
//     if (this.scale.isFullscreen) {
//       this.scale.stopFullscreen();
//       // On stop fulll screen
//     } else {
//       this.scale.startFullscreen();
//       // On start fulll screen
//     }
//   });
//   // fullscreenButton.setBlendMode(Phaser.BlendModes.MULTIPLY);
// }

// function createGraphicsBackground(this: Scene) {
//   var color = 0x282648; // mult
//   var alpha = 0.35;

//   const rect = this.add.rectangle(160, 110, 300, 200, color, alpha);
//   // rect.setBlendMode(Phaser.BlendModes.MULTIPLY);
//   rect.setStrokeStyle(1, color, 1);
//   rect.isStroked = true;

//   createLoremText.call(this);
// }

// function createLoremText(this: Scene) {
//   const text = this.add.text(10, 10, lorem, {
//     fontFamily: 'Oswald-SemiBold',
//     fontSize: 14,
//     wordWrap: {
//       width: 280,
//     },
//   });
//   text.setShadow(0, 1, '#333', 2, false, true);
// }

async function createBackground(this: Scene) {
  return new Promise((resolve, reject) => {
    const bg = this.add.image(0, 0, 'kairens-tree');
    bg.alpha = 0;
    bg.setOrigin(0, 0);
    console.log(' > bg:', bg);
    bg.scale = 0.3;
    bg.x = 80;
    bg.y = 30;
    // const { width, height } = bg;
    // const aspectRatio = width / height;
    // console.log(' > aspectRatio:', aspectRatio);

    // const newWidth = this.sys.canvas.width;
    // bg.displayHeight = width / height = newWidth / newHeight
    // width * newHeight = height * newWidth;
    // const newHeight = (height * newWidth) / width;

    // bg.displayWidth = this.sys.canvas.width;
    // bg.displayHeight = this.sys.canvas.height;

    // bg.setBlendMode(Phaser.BlendModes.MULTIPLY);

    this.tweens.add({
      targets: bg,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      delay: 0,
      duration: 1600,
      repeat: 0,
      yoyo: false,
      onComplete: () => {
        resolve();
      },
    });
  });
}

// function preloadFonts(this: Scene, fonts: Set<string>) {
//   console.log('preloadFonts > fonts:', fonts);
//   const fontsArr = Array.from(fonts);
//   fontsArr.forEach((fontFamily) => {
//     this.add.text(0, -100, '', {
//       fontFamily,
//     });
//   });
// }