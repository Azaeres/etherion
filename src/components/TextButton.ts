import Phaser, { Scene } from 'phaser';

const DEFAULT_MENU_ITEM_STYLE = {
  color: 'white',
  fontSize: '32px',
  fontFamily: 'OpenSansCondensed-Bold',
};

const DEPRESS_SCALE = 0.96;
const DISABLE_ALPHA = 0.3;

interface PointerWithTarget extends Phaser.Input.Pointer {
  target?: any;
}

export default class TextButton extends Phaser.GameObjects.Text {
  private _disabled: boolean;
  private _action?: Function;

  constructor({
    scene,
    x,
    y,
    text,
    style = DEFAULT_MENU_ITEM_STYLE,
    disabled = false,
    action,
  }: {
    scene: Scene;
    x: number;
    y: number;
    text: string | string[];
    style?: Phaser.Types.GameObjects.Text.TextStyle;
    disabled?: boolean;
    action?: Function;
  }) {
    super(scene, x, y, text, style);

    this._disabled = disabled;
    this.setOrigin(0.5, 0.5);
    this._action = action;

    if (disabled) {
      this.alpha = DISABLE_ALPHA;
    } else {
      this.setInteractive({ useHandCursor: true });
      this.startListening();
    }
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public disable() {
    this._disabled = true;
    this.stopListening();
    this.setInteractive({ useHandCursor: false });
    this.release();
    this.scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: DISABLE_ALPHA },
      ease: 'Linear',
      delay: 0,
      duration: 50,
      repeat: 0,
      yoyo: false,
    });
  }

  public enable() {
    this._disabled = false;
    this.startListening();
    this.setInteractive({ useHandCursor: true });
    this.scene.tweens.add({
      targets: this,
      alpha: { from: DISABLE_ALPHA, to: 1 },
      ease: 'Linear',
      delay: 0,
      duration: 50,
      repeat: 0,
      yoyo: false,
    });
  }

  protected depress(pointer: PointerWithTarget) {
    console.log('depress  :');
    console.log(' > pointer:', pointer);
    pointer.target = this;
    console.log(' > pointer.target:', pointer.target);
    if (!this._disabled) {
      this.scene.tweens.add({
        targets: this,
        scale: { from: 1, to: DEPRESS_SCALE },
        ease: 'Linear',
        delay: 0,
        duration: 30,
        repeat: 0,
        yoyo: false,
      });
    }
  }

  protected release(pointer?: PointerWithTarget) {
    console.log('release :');
    if (this.scale !== 1) {
      this.scene.tweens.add({
        targets: this,
        scale: { from: DEPRESS_SCALE, to: 1 },
        ease: 'Linear',
        delay: 0,
        duration: 30,
        repeat: 0,
        yoyo: false,
      });
    }
  }

  protected async action(...args: any) {
    console.log('action > :');
    if (this._action) {
      const [pointer] = args;
      console.log(' > pointer.target:', pointer.target);
      if (pointer.target === this) {
        const t0 = performance.now();
        await this._action.apply(this, args);
        const t1 = performance.now();
        const ms = t1 - t0;
        console.log('Done > ms:', ms);
      }
    }
  }

  protected over(pointer: PointerWithTarget) {
    console.log('over  :');
    if (pointer.target === this) {
      if (pointer.primaryDown) {
        this.depress(pointer);
      } else {
        // depress(pointer);
        console.log('clearing target!!! :');
        pointer.target = undefined;
      }
    }
  }

  protected startListening() {
    this.on('pointerdown', this.depress)
      .on('pointerup', this.release)
      .on('pointerout', this.release)
      .on('pointerover', this.over);
    this._action && this.on('pointerup', this.action);
  }

  protected stopListening() {
    this.removeAllListeners();
  }
}
