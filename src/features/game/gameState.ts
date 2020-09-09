import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';
import { SceneIds } from '../scenes';

type GameStateV2 = {
  camera: CameraV2;
};

export type CameraV2 = {
  scene: SceneIds;
  props?: object;
};

const initialState: GameStateV2 = {
  camera: {
    scene: 'SimpleScene',
  },
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    navigate: (state: GameStateV2, action: PayloadAction<CameraV2>) => {
      console.log('Navigate reducer  :');
      state.camera = action.payload;
    },
  },
});

export const { navigate } = gameSlice.actions;

export const selectCamera = (state: RootState): CameraV2 => state.game.camera;

export default gameSlice.reducer;

type GameState = {
  camera: Camera;
};

export type Camera = {
  toScene: SceneIds;
  props?: object;
};

export function migrateGameStateToGameStateV2(state: GameState): GameStateV2 {
  const newCamera: CameraV2 = migrateCameraToCameraV2(state.camera);
  return {
    camera: newCamera,
  };
}

function migrateCameraToCameraV2(camera: Camera): CameraV2 {
  if (camera.props) {
    return { scene: camera.toScene, props: camera.props };
  } else {
    return { scene: camera.toScene };
  }
}

/* 
  {
    "camera": {
      "toScene": "CounterScene",
      "props": {
        "foo": "bar"
      }
    }
  }
*/
