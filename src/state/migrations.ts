import { MigrationManifest } from 'redux-persist';
import { RootState } from './store';
import { migrateGameStateToGameStateV2 } from '../features/game/gameState';

const migrations: MigrationManifest = {
  0: (state: RootState) => {
    return { ...state, game: migrateGameStateToGameStateV2(state.game) };
  },
  // 0: (state: RootState) => {
  //   console.log('Running migration 0 > state:', state);
  //   const result = {
  //     ...state,
  //     game: {
  //       test: 1,
  //     },
  //   };
  //   console.log('migration  > result:', result);
  //   return result;
  // },
  // 1: (state: RootState) => {
  //   return { ...state, game: { test: undefined } };
  // },
};

export default migrations;
