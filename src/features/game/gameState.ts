import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';
import { Immutable } from '../../state/types';
import { SceneIds } from '../scenes';

type GameState = Immutable<{
  camera: {
    scene: SceneIds;
  };
}>;

const initialState: GameState = {
  camera: {
    scene: 'SimpleScene',
  },
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<SceneIds>) => {
      state.camera.scene = action.payload;
    },
  },
});

export const { navigate } = gameSlice.actions;

export const selectCurrentScene = (state: RootState) => state.game.camera.scene;

export default gameSlice.reducer;
