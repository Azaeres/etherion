import {
  ThunkAction,
  Action,
  configureStore,
  Store,
  combineReducers,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import counterReducer from '../features/counter/counterState';
import appReducer from '../appState';
import gameReducer from '../features/game/gameState';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import migrations from './migrations';

const persistConfig = {
  key: 'root',
  storage,
  debug: true,
  version: 0,
  migrate: createMigrate(migrations, { debug: true }),
};

// Type fix:
const {
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore,
  middleware: offlineMiddleware,
}: {
  enhanceReducer: any;
  enhanceStore: any;
  middleware: any;
} = createOffline({
  ...offlineConfig,
  persist: (store) => {
    console.log('persisting...  > store:', store);
    const currentState = store.getState();
    console.log(' > currentState:', currentState);
    return store;
  },
});

const combinedReducers = combineReducers({
  app: appReducer,
  game: gameReducer,
  counter: counterReducer,
});

const persistedReducer = persistReducer(
  persistConfig,
  offlineEnhanceReducer(combinedReducers)
);

const middleware = [thunk, offlineMiddleware];
process.env.NODE_ENV === 'development' && middleware.push(logger);

export const store: Store = configureStore({
  reducer: persistedReducer,
  middleware,
  enhancers: [offlineEnhanceStore],
});

export const persistor = persistStore(
  store /*, null, () => {
  console.log('persist rehydrated! :');
  // store.dispatch(markIsUpdated());
  // store.dispatch(migrate());
} */
);

console.log(' > persistor:', persistor);

const currentState = store.getState();
console.log(' > currentState:', currentState);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
