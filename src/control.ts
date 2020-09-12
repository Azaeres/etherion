import { increment } from './components/counter/counterState';
import { store } from './state/store';

// Global types declared in `./globals.d.ts`
const CONTROL = {
  incrementCounter() {
    store.dispatch(increment());
  },
};

window.__APP__ = CONTROL;

export default CONTROL;
