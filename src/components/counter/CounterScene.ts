import { store } from '../../state/store';
import { Scene } from 'phaser';
import { decrement, increment, incrementAsync } from './counterState';
import { navigate } from '../game/gameState';

import testBackground from '../../test_background.jpg';
import createCountText, { countTextFonts } from './CountText';
import SpriteButton from './SpriteButton';
// import createEtherionLogo, { preloadEtherionLogo } from './EtherionLogo';
import { selectNeedsUpdate } from '../../appState';
import preloadFonts from '../../util/preloadFonts';
import { version } from '../../../package.json';
import TextButton from '../TextButton';
import etherionLogo from '../../etherion_logo-3.png';
// import TextButton from '../TextButton';
// import TextButton from '../TextButton';
// import createButton from '../Button';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in pellentesque purus. Nam eu finibus nibh. Ut porttitor vehicula tortor, id convallis orci porta sed. Pellentesque turpis tortor, faucibus eu placerat eu, tempor id nibh. Donec sollicitudin sem nunc, eu commodo velit maximus vitae. Aliquam eleifend ex sit amet tortor suscipit tempus. Nullam venenatis porta rhoncus. Ut malesuada magna non mauris tincidunt commodo.`;

const DEFAULT_BUTTON_STYLE = {
  // backgroundColor: 'white',
  color: 'white',
  fontSize: 64,
  fontFamily: 'Oswald-ExtraLight',
  // fontStyle: 'bold',
  // fontWeight: 700,
  // padding: {
  //   left: 6,
  //   right: 6,
  //   top: 6,
  //   bottom: 6,
  // },
};

// const DEFAULT_MENU_ITEM_STYLE = {
//   color: 'white',
//   fontSize: 32,
//   fontFamily: 'OpenSansCondensed-Bold',
// };

type CounterSceneProps = { foo: string };

export default class CounterScene extends Scene {
  props: CounterSceneProps = { foo: 'foo' };
  propText?: TextButton;
  // propTextToggle: boolean = false;

  init(data: { foo: string }) {
    console.log('CounterScene init - data:', data);
    this.props = data;

    // this.imageID = data.id;
    // this.imageFile = data.image;
  }

  preload() {
    this.load.image('background', testBackground);
    this.load.image('LogoImage_etherionLogo', etherionLogo);

    // this.preloadEtherionLogo();
    // this.preloadLogoImage();
    this.preloadFonts([
      ...countTextFonts,
      'Oswald-ExtraLight',
      'Oswald-Light',
      'Oswald-Regular',
      'Oswald-SemiBold',
      'OpenSansCondensed-Bold',
    ]);
  }

  async create() {
    console.log('CounterScene create > this.props:', this.props);

    await this.createBackground();
    // this.createEtherionLogo();
    this.createGraphicsBackground();
    this.createFullscreenButton({ text: `FS----` });
    this.createSubtractButton({ onPointerUp: this.onSub });
    this.createAsyncButton({ onPointerUp: this.onIncrementAsync });
    this.createCountText({ x: 100, y: 200 });
    this.createCountText({ x: 200, y: 200 });
    this.createAddButton({ x: 400, y: 200, onPointerUp: this.onAdd });
    this.createAddButton({ x: 40, y: 400, onPointerUp: this.onAdd });

    this.createEtherionLogo();

    this.createNeedsUpdateNotification();
    const nextSceneButton = new TextButton({
      scene: this,
      x: 680,
      y: 300,
      text: 'Next Scene',
      action: async () => {
        return store.dispatch(
          navigate({ sceneId: 'SimpleScene', props: { bar: 'baz' } })
        );
      },
      disabled: true,
    });
    this.add.existing(nextSceneButton);

    let toggleDisabled = true;
    const disableToggleButton = new TextButton({
      scene: this,
      x: 680,
      y: 360,
      text: 'Enable',
      action: () => {
        toggleDisabled = !toggleDisabled;
        if (toggleDisabled) {
          nextSceneButton.disable();
          disableToggleButton.setText('Enable');
        } else {
          nextSceneButton.enable();
          disableToggleButton.setText('Disable');
        }
      },
    });
    this.add.existing(disableToggleButton);

    this.createVersionText({ x: 818, y: 465 });
    this.propText = new TextButton({
      scene: this,
      x: 300,
      y: 400,
      text: this.props.foo,
      style: { fontSize: 48 },
      action: () => {
        const nextFoo = this.props.foo === 'bar' ? 'foo' : 'bar';
        store.dispatch(
          navigate({
            sceneId: 'CounterScene',
            props: { foo: nextFoo },
          })
        );
      },
    });
    this.add.existing(this.propText);
  }

  createEtherionLogo() {
    const spriteButton = new SpriteButton({
      scene: this,
      x: this.sys.canvas.width - 150,
      y: 150,
      texture: 'LogoImage_etherionLogo',
      action: async () => {
        return await store.dispatch(navigate({ sceneId: 'LogoScene' }));
      },
    });
    this.add.existing(spriteButton);
    this.tweens.add({
      targets: spriteButton,
      angle: { from: 360, to: 0 },
      ease: 'Linear',
      // delay: 800,
      duration: 2700,
      repeat: -1,
      yoyo: false,
    });
  }

  propsDidChange(nextProps: CounterSceneProps) {
    console.log('propsDidChange  > nextProps:', nextProps);
    this.props = nextProps;
    console.log(' > this.props:', this.props);
    // console.log(' > this.propTextToggle:', this.propTextToggle);
    if (this.propText) {
      this.propText.text = this.props.foo;
    }
  }

  // Event handlers

  onAdd = () => {
    const action = increment();
    store.dispatch(action);
  };

  onSub = () => {
    const action = decrement();
    store.dispatch(action);
  };

  onIncrementAsync = async () => {
    console.log('onIncrementAsync  :');
    return await store.dispatch(incrementAsync(1));
  };

  // Mixins
  preloadFonts = preloadFonts.bind(this);
  // preloadLogoImage = preloadLogoImage.bind(this);
  // preloadEtherionLogo = preloadEtherionLogo.bind(this);

  // createEtherionLogo = createEtherionLogo.bind(this);
  createBackground = createBackground.bind(this);
  // createLogoImage = createLogoImage.bind(this);
  createGraphicsBackground = createGraphicsBackground.bind(this);
  createFullscreenButton = createFullscreenButton.bind(this);
  createSubtractButton = createSubtractButton.bind(this);
  createAsyncButton = createAsyncButton.bind(this);
  createCountText = createCountText.bind(this);
  createAddButton = createAddButton.bind(this);
  createNeedsUpdateNotification = createNeedsUpdateNotification.bind(this);
  // createButton = createButton.bind(this);
  createVersionText = createVersionText.bind(this);
  createText = createText.bind(this);
}

function createText(
  this: Scene,
  {
    x = 100,
    y = 100,
    style = {},
    text = '',
    onPointerUp,
  }: {
    x?: number;
    y?: number;
    style?: object;
    text: string;
    onPointerUp?: () => void;
  }
) {
  const defaultStyle = { color: 'white', fontSize: 12 };
  const mergedStyles = { ...defaultStyle, ...style };
  const sceneText = this.add.text(x, y, text, mergedStyles);
  if (onPointerUp) {
    sceneText.setInteractive({ useHandCursor: true });
    sceneText.on('pointerup', onPointerUp);
  }
  return sceneText;
}

function createVersionText(
  this: Scene,
  {
    x = 100,
    y = 100,
    buttonStyle = { color: 'white', fontSize: 8 },
  }: { x?: number; y?: number; buttonStyle?: object }
) {
  const versionText = this.add.text(x, y, `v${version}`, buttonStyle);
  versionText.alpha = 0.7;
}

// interface PointerWithTarget extends Phaser.Input.Pointer {
//   target?: any;
// }

// function createNextSceneButton(
//   this: Scene,
//   {
//     x = 250,
//     y = 250,
//     onPointerUp,
//     buttonStyle = DEFAULT_MENU_ITEM_STYLE,
//     disabled = true,
//   }: {
//     x?: number;
//     y?: number;
//     onPointerUp?: () => Promise<any>;
//     buttonStyle?: object;
//     disabled?: boolean;
//   }
// ) {
//   let _disabled = disabled;
//   const swapSceneButton = this.add.text(x, y, 'Next Scene', buttonStyle);
//   // swapSceneButton.alpha = 0;
//   if (disabled) {
//     swapSceneButton.alpha = 0.3;
//   } else {
//     swapSceneButton.setInteractive({ useHandCursor: true });
//   }
//   // swapSceneButton.setSize(200, 50);
//   // swapSceneButton.originX = 1.0;

//   const disable = () => {
//     _disabled = true;
//     swapSceneButton.alpha = 0.3;
//     swapSceneButton.setInteractive({ useHandCursor: false });
//     release();
//   };

//   const enable = () => {
//     _disabled = false;
//     swapSceneButton.alpha = 1;
//     swapSceneButton.setInteractive({ useHandCursor: true });
//   };

//   // let _depressedTarget: Phaser.GameObjects.Text;
//   const depress = (pointer: PointerWithTarget) => {
//     // const currentTarget = pointer.event.currentTarget;
//     // console.log(' > currentTarget:', currentTarget);
//     console.log('depress  > swapSceneButton:', swapSceneButton);
//     // _depressedTarget = swapSceneButton;
//     console.log(' > pointer:', pointer);
//     console.log(' > pointer:', pointer);
//     pointer.target = swapSceneButton;
//     if (!_disabled) {
//       // _depressedTarget = swapSceneButton;
//       swapSceneButton.scale = 0.98;
//     }
//   };

//   const release = () => {
//     swapSceneButton.scale = 1.0;
//   };

//   swapSceneButton.on('pointerdown', depress);
//   swapSceneButton.on('pointerup', release);
//   swapSceneButton.on('pointerout', release);
//   swapSceneButton.on('pointerover', (pointer: PointerWithTarget) => {
//     if (pointer.target === swapSceneButton) {
//       if (pointer.noButtonDown()) {
//         release();
//       } else {
//         depress(pointer);
//       }
//     }
//   });

//   onPointerUp &&
//     swapSceneButton.on('pointerup', async (...args: any) => {
//       const [pointer] = args;
//       if (pointer.target === swapSceneButton) {
//         const t0 = performance.now();
//         // swapSceneButton.scale = 0.9;

//         // Disabled for testing purposes...
//         await onPointerUp.apply(this, args);
//         // console.log('Navigation placeholder  :');
//         // // console.log(' > args:', args);
//         // console.log(' > pointer:', pointer);
//         // console.log(' > swapSceneButton:', swapSceneButton);

//         // swapSceneButton.scale = 1;
//         const t1 = performance.now();
//         const ms = t1 - t0;
//         console.log('Done > ms:', ms);
//       }
//     });

//   return {
//     disable,
//     enable,
//     isDisabled: () => _disabled,
//   };

//   // this.tweens.add({
//   //   targets: swapSceneButton,
//   //   alpha: { from: 0, to: 1 },
//   //   ease: 'Linear',
//   //   delay: 0,
//   //   duration: 1600,
//   //   repeat: 0,
//   //   yoyo: false,
//   // });
// }

function createNeedsUpdateNotification(this: Scene) {
  const state = store.getState();
  const needsUpdate = selectNeedsUpdate(state);
  const alpha = needsUpdate ? 1 : 0;

  const needsUpdateNotificationText = this.add.text(
    600,
    10,
    'Update is available!',
    {
      fontSize: 14,
      fontFamily: 'OpenSansCondensed-Bold',
    }
  );
  needsUpdateNotificationText.alpha = alpha;
  // console.log(' > needsUpdateNotificationText:', needsUpdateNotificationText);

  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    const nowNeedsUpdate = selectNeedsUpdate(state);
    needsUpdateNotificationText.alpha = nowNeedsUpdate ? 1 : 0;
  });
  needsUpdateNotificationText.on('destroy', () => {
    unsubscribe();
  });
  // setTimeout(() => {
  //   const action = markIsUpdated();
  //   store.dispatch(action);
  // }, 2000);
}

function createAddButton(
  this: Scene,
  {
    x = 250,
    y = 250,
    onPointerUp = () => {},
    buttonStyle = DEFAULT_BUTTON_STYLE,
  }: { x?: number; y?: number; onPointerUp?: () => void; buttonStyle?: object }
) {
  const addButton = new TextButton({
    scene: this,
    x,
    y,
    text: '+',
    style: buttonStyle,
    action: onPointerUp,
  });
  this.add.existing(addButton);
  // const addButton = this.add.text(x, y, '+', buttonStyle);
  // addButton.setInteractive({ useHandCursor: true });
  // addButton.on('pointerup', onPointerUp);
}

function createAsyncButton(
  this: Scene,
  { onPointerUp = () => {} }: { onPointerUp: () => Promise<any> | void }
) {
  const addAsyncButton = new TextButton({
    scene: this,
    x: 285 + 285 / 2,
    y: 285,
    text: 'Add Async',
    style: DEFAULT_BUTTON_STYLE,
    action: async (...args: any) => {
      console.log('on pointerup  > args:', args);
      await onPointerUp.apply(this, args);
    },
  });
  addAsyncButton.setShadow(0, 4, '#333', 6, false, true);
  this.add.existing(addAsyncButton);
}

function createSubtractButton(
  this: Scene,
  { onPointerUp = () => {} }: { onPointerUp: () => void }
) {
  const addButton = new TextButton({
    scene: this,
    x: 560,
    y: 220,
    action: onPointerUp,
    style: DEFAULT_BUTTON_STYLE,
    text: '-',
  });
  this.add.existing(addButton);
}

function createFullscreenButton(
  this: Scene,
  {
    x = 480,
    y = 40,
    text = 'Fullscreen',
    style = DEFAULT_BUTTON_STYLE,
  }: {
    x?: number;
    y?: number;
    text?: string | string[];
    style?: object;
  } = {}
) {
  this.scale.on('fullscreenunsupported', (...args: any) => {
    this.add.text(400, 100, 'fullscreen is unsupported!');
  });

  const fullscreenButton = new TextButton({
    scene: this,
    x,
    y,
    text,
    style,
    action: () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
        // On stop fulll screen
      } else {
        this.scale.startFullscreen();
        // On start fulll screen
      }
    },
  });
  this.add.existing(fullscreenButton);
}

function createGraphicsBackground(this: Scene) {
  var color = 0x282648; // mult
  var alpha = 0.35;

  const rect = this.add.rectangle(160, 110, 300, 200, color, alpha);
  // rect.setBlendMode(Phaser.BlendModes.MULTIPLY);
  rect.setStrokeStyle(1, color, 1);
  rect.isStroked = true;

  createLoremText.call(this);
}

function createLoremText(this: Scene) {
  const text = this.add.text(10, 10, lorem, {
    fontFamily: 'Oswald-SemiBold',
    fontSize: 14,
    wordWrap: {
      width: 280,
    },
  });
  text.setShadow(0, 1, '#333', 2, false, true);
}

async function createBackground(this: Scene) {
  return new Promise((resolve, reject) => {
    const bg = this.add.image(0, 0, 'background');
    bg.alpha = 0;
    bg.setOrigin(0, 0);
    bg.displayWidth = this.sys.canvas.width;
    bg.displayHeight = this.sys.canvas.height;

    // bg.setBlendMode(Phaser.BlendModes.MULTIPLY);

    this.tweens.add({
      targets: bg,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      delay: 100,
      duration: 200,
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
