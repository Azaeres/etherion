import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import counterReducer from '../features/counter/counterState';
import appReducer, { markIsUpdated } from '../appState';
import gameReducer from '../features/game/gameState';

// Type fix:
const enhancer: any = offline({
  ...offlineConfig,
  persistCallback: () => {
    // console.log('persist rehydrated! :');
    store.dispatch(markIsUpdated());
  },
});
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'development'
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  enhancers: [enhancer],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
