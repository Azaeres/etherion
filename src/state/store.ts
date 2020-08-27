import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import counterReducer from '../features/counter/counterState';
import appReducer from '../appState';

// Type fix:
const enhancer: any = offline(offlineConfig);
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    app: appReducer,
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
