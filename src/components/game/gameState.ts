import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import { RootState, AppThunk, store } from '../../state/store';
import { SceneIds } from '../scenes';
import moveCameraToScene from '../../util/moveCameraToScene';
import { PERSIST_REHYDRATE } from '@redux-offline/redux-offline/lib/constants';
import { game } from './PhaserGame';

export type GameState = {
  camera: Camera;
};

export type Camera = {
  currentScene?: SceneVariant;
  lastScene?: SceneVariant;
};

export type SceneVariant = {
  sceneId: SceneIds;
  props?: object;
};

const initialState: GameState = {
  camera: {},
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    navigate: (state: GameState, action: PayloadAction<SceneVariant>) => {
      console.log('Navigate reducer  :');
      const lastScene = state.camera.currentScene;
      state.camera.currentScene = action.payload;
      state.camera.lastScene = lastScene;
    },
  },
});

export const selectCurrentScene = (state: RootState): SceneVariant =>
  state.game.camera.currentScene;

export default combinedReducer;

function combinedReducer(state: RootState, action: AnyAction) {
  return nonScopedReducer(gameSlice.reducer(state, action), action);
}

function nonScopedReducer(state: RootState, action: AnyAction) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      console.log('PERSIST_REHYDRATE  > state:', state);
      // const toScene: SceneVariant = state.camera.currentScene;
      // console.log(' > toScene:', toScene);
      setTimeout(() => {
        const state = store.getState();
        const currentScene: SceneVariant = selectCurrentScene(state);
        console.log(' > currentScene:', currentScene);
        if (currentScene) {
          moveCameraToScene.call(game, {
            fromScene: undefined,
            toScene: currentScene,
          });
        } else {
          const defaultScene: SceneVariant = { sceneId: 'SimpleScene' };
          moveCameraToScene.call(game, {
            fromScene: undefined,
            toScene: defaultScene,
          });
        }
      }, 0);
      return state;
    default:
      return state;
  }
}

const { navigate: _navigate } = gameSlice.actions;

export const navigate = (toScene: SceneVariant): AppThunk => (
  dispatch,
  getState: () => any
) => {
  console.log('navigate :');
  const state = getState();
  console.log(' > state:', state);
  console.log(' > toScene:', toScene);
  const fromScene = state.game.camera.currentScene;
  console.log(' > fromScene:', fromScene);

  return moveCameraToScene
    .call(game, {
      fromScene,
      toScene,
    })
    .then(() => {
      return dispatch(_navigate(toScene));
    });
};
