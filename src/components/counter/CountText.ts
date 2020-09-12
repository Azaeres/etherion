import { store } from '../../state/store';
import { Scene } from 'phaser';
import { selectCount } from './counterState';
import { Immutable } from '../../state/types';

export const countTextFonts: Immutable<string[]> = ['Oswald-SemiBold'];

const STYLE = {
  color: 'white',
  fontSize: 48,
  fontFamily: 'Oswald-SemiBold',
};

const DEFAULT_X = 380;
const DEFAULT_Y = 180;

export default function createCountText(
  this: Scene,
  {
    x = DEFAULT_X,
    y = DEFAULT_Y,
    style = STYLE,
  }: {
    x?: number;
    y?: number;
    style?: object | undefined;
  }
) {
  const state = store.getState();
  const count = selectCount(state);
  const countText = this.add.text(x, y, String(count), style);
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    const count = selectCount(state);
    countText.setText(String(count));
  });
  countText.on('destroy', () => {
    unsubscribe();
  });
}
