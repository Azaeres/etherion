import {
  ThunkAction,
  Action,
  configureStore,
  Store,
  combineReducers,
  compose,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import counterReducer from '../features/counter/counterState';
import appReducer from '../appState';
import gameReducer from '../features/game/gameState';
// import {
//   persistStore,
//   persistReducer,
//   createMigrate,
//   Persistor,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import createMigration from './createMigration';

// import * as constants from 'redux-persist/es/constants'
// import constants from 'redux-persist/lib/constants'
// import createMigration from 'redux-persist-migrate';
// import * as reduxPersistMigrate from 'redux-persist-migrate';
// import * as constants from 'redux-persist'

// console.log(' > reduxPersistMigrate:', reduxPersistMigrate);

import manifest from './migrations';
// import * as reduxPersist from 'redux-persist';
// console.log(' > reduxPersist:', reduxPersist);

// Encountered incompatibility between `redux-offline` and `redux-persist` v6.
// Errors generated persisting to/from storage.
// Reverted redux-persist to v4.
// Enabling migrations with `redux-persist-migrate`.
// Per https://github.com/redux-offline/redux-offline/issues/119#issuecomment-608533166

// VERSION_REDUCER_KEY is the key of the reducer you want to store the state version in.
// You _must_ create this reducer, redux-persist-migrate will not create it for you.
// In this example after migrations run, `state.app.version` will equal `2`
const VERSION_REDUCER_KEY = 'migration';

// const persistConfig = {
//   key: 'root',
//   storage,
//   debug: true,
//   version: 0,
//   migrate: createMigrate(migrations, { debug: true }),
// };

// console.log(' > offlineConfig:', offlineConfig);

// let persistor: Persistor;

const migration = createMigration(
  manifest,
  VERSION_REDUCER_KEY
  // (state: any) => state[VERSION_REDUCER_KEY].version,
  // (state: any, version: number) => {
  //   return {
  //     ...state,
  //     [VERSION_REDUCER_KEY]: {
  //       ...state[VERSION_REDUCER_KEY],
  //       version: version,
  //     },
  //   };
  // }
);

// Type fix:
const {
  enhanceReducer: offlineEnhanceReducer,
  enhanceStore: offlineEnhanceStore,
  middleware: offlineMiddleware,
}: {
  enhanceReducer: any;
  enhanceStore: any;
  middleware: any;
} = createOffline(offlineConfig);

const combinedReducers = combineReducers({
  [VERSION_REDUCER_KEY]: (state = {}) => state, // This reducer will be used to store the version
  app: appReducer,
  game: gameReducer,
  counter: counterReducer,
});

// const persistedReducer = persistReducer(
//   persistConfig,
//   offlineEnhanceReducer(combinedReducers)
// );

const enhancer: any = compose(offlineEnhanceStore, migration);

const middleware = [thunk, offlineMiddleware];
process.env.NODE_ENV === 'development' && middleware.push(logger);

export const store: Store = configureStore({
  reducer: offlineEnhanceReducer(combinedReducers),
  middleware,
  enhancers: [enhancer],
});

store.dispatch({ type: 'foo' });

// export const persistor: Persistor = persistStore(
//   store /*, null, () => {
//   console.log('persist rehydrated! :');
//   // store.dispatch(markIsUpdated());
//   // store.dispatch(migrate());
// } */
// );

// console.log(' > persistor:', persistor);

// const currentState = store.getState();
// console.log(' > currentState:', currentState);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
