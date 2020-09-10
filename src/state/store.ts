import {
  ThunkAction,
  Action,
  configureStore,
  Store,
  combineReducers,
  compose,
  AnyAction,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import counterReducer from '../features/counter/counterState';
import appReducer from '../appState';
import gameReducer from '../features/game/gameState';
import thunk, { ThunkDispatch } from 'redux-thunk';
import createMigration from './createMigration';

import manifest from './migrations';

type DispatchFunctionType = ThunkDispatch<RootState, undefined, AnyAction>;

// Encountered incompatibility between `redux-offline` and `redux-persist` v6.
// Errors generated persisting to/from storage.
// Reverted redux-persist to v4.
// Enabling migrations with `redux-persist-migrate`.
// Per https://github.com/redux-offline/redux-offline/issues/119#issuecomment-608533166

// VERSION_REDUCER_KEY is the key of the reducer you want to store the state version in.
// You _must_ create this reducer, redux-persist-migrate will not create it for you.
// In this example after migrations run, `state.app.version` will equal `2`
const VERSION_REDUCER_KEY = 'migration';

const migration = createMigration(manifest, VERSION_REDUCER_KEY);

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

const enhancer: any = compose(offlineEnhanceStore, migration);

const middleware = [thunk, offlineMiddleware];
process.env.NODE_ENV === 'development' && middleware.push(logger);

export const store: Store<any, Action<any>> & {
  dispatch: DispatchFunctionType;
} = configureStore({
  reducer: offlineEnhanceReducer(combinedReducers),
  middleware,
  enhancers: [enhancer],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
