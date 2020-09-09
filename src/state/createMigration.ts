// https://github.com/wildlifela/redux-persist-migrate
import { PERSIST_REHYDRATE } from '@redux-offline/redux-offline/lib/constants';
import { Dispatch, AnyAction, Store } from 'redux';
import { RootState } from './store';
import { Reducer } from 'react';

console.log(' > PERSIST_REHYDRATE:', PERSIST_REHYDRATE);

export type PersistState = {
  version: number;
  rehydrated: boolean;
};

export type PersistedState = {
  _persist: PersistState;
} | void;

export type MigrationManifest = {
  [Key: number]: (PersistedState: PersistedState) => PersistedState;
};

const processKey = (key: string): number => {
  let int = parseInt(key);
  if (isNaN(int))
    throw new Error(
      'redux-persist-migrate: migrations must be keyed with integer values'
    );
  return int;
};

export default function createMigration(
  manifest: MigrationManifest,
  versionSelector_?: string | Function,
  versionSetter_?: Function
) {
  console.log(
    'createMigration  > manifest, versionSelector_:',
    manifest,
    versionSelector_
  );
  let _versionSelector: Function;
  let _versionSetter: Function;
  if (typeof versionSelector_ === 'string') {
    let reducerKey = versionSelector_;
    _versionSelector = (state: RootState) =>
      state && state[reducerKey] && state[reducerKey].version;
    _versionSetter = (state: RootState, version: number) => {
      console.log('_versionSetter  > state, version:', state, version);
      if (['undefined', 'object'].indexOf(typeof state[reducerKey]) === -1) {
        console.error(
          'redux-persist-migrate: state for versionSetter key must be an object or undefined'
        );
        return state;
      }
      state[reducerKey] = state[reducerKey] || {};
      state[reducerKey].version = version;
      return state;
    };
  }

  const versionKeys = Object.keys(manifest)
    .map(processKey)
    .sort((a, b) => a - b);
  console.log(' > versionKeys:', versionKeys);
  let currentVersion = versionKeys[versionKeys.length - 1];
  if (!currentVersion && currentVersion !== 0) currentVersion = -1;
  console.log(' > currentVersion:', currentVersion);

  const migrationDispatch = (next: Dispatch) => (action: AnyAction) => {
    console.log('Migration reducer  > action:', action);
    if (action.type === PERSIST_REHYDRATE) {
      const incomingState = action.payload;
      console.log(' > incomingState:', incomingState);
      let incomingVersion: number | null = parseInt(
        _versionSelector(incomingState)
      );
      if (isNaN(incomingVersion)) incomingVersion = null;
      console.log(' > incomingVersion:', incomingVersion);

      if (incomingVersion !== currentVersion) {
        const migratedState = migrate(incomingState, incomingVersion);
        console.log(' > migratedState:', migratedState);
        action.payload = migratedState;
      }
    }
    return next(action);
  };

  const migrate = (state: RootState, version: number | null): RootState => {
    console.log('migrate  > state, version:', state, version);
    versionKeys
      .filter((v) => version === null || v > version)
      .forEach((v) => {
        state = manifest[v](state);
      });

    state = _versionSetter(state, currentVersion);
    console.log('next  > state:', state);
    return state;
  };

  return (next: any) => <T extends { [key: string]: any }>(
    reducer: Reducer<RootState, AnyAction>,
    initialState: RootState,
    enhancer: any
  ): Store<T> => {
    console.trace('migration enhance :');
    console.log(
      ' > reducer, initialState, enhancer:',
      reducer,
      initialState,
      enhancer
    );
    const store = next(reducer, initialState, enhancer);
    console.log(' > store:', store);
    const dispatch = migrationDispatch(store.dispatch);
    console.log(' > migrationDispatch:', migrationDispatch);
    return {
      ...store,
      dispatch,
    };
  };
}
