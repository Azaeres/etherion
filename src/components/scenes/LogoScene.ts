import { Scene } from 'phaser';

import { store } from '../../state/store';
import { navigate } from '../game/gameState';
import createEtherionLogo, {
  preloadEtherionLogo,
} from '../counter/EtherionLogo';
// import moveCameraToScene from '../../util/moveCameraToScene';

// const DEFAULT_MENU_ITEM_STYLE = {
//   color: 'white',
//   fontSize: 32,
//   fontFamily: 'OpenSansCondensed-Bold',
// };

export default class LogoScene extends Scene {
  preload() {
    this.preloadEtherionLogo();
    // this.load.image('kairens-tree', kairensTreeImage);
  }

  async create() {
    await this.createEtherionLogo();
    store.dispatch(navigate({ sceneId: 'SimpleScene' }));
    // const bg = this.createBackground();
    // const swapSceneButton = this.createNextSceneButton({
    //   x: 630,
    //   y: 150,
    //   onPointerUp: () =>
    //     store.dispatch(
    //       navigate({ scene: 'CounterScene', props: { foo: 'bar' } })
    //     ),
    // });
    // this.tweens.add({
    //   targets: [bg, swapSceneButton],
    //   alpha: { from: 0, to: 1 },
    //   ease: 'Linear',
    //   delay: 0,
    //   duration: 1600,
    //   repeat: 0,
    //   yoyo: false,
    // });
  }

  // Mixins
  // preloadFonts = preloadFonts.bind(this);
  preloadEtherionLogo = preloadEtherionLogo.bind(this);
  createEtherionLogo = createEtherionLogo.bind(this);

  // createBackground = createBackground.bind(this);
  // createNextSceneButton = createNextSceneButton.bind(this);
}
