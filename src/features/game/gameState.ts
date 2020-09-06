import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';
import { Immutable } from '../../state/types';
import { SceneIds } from '../scenes';

type GameState = Immutable<{
  camera: Camera;
}>;

export type Camera = Immutable<{
  toScene: SceneIds;
  props?: object;
}>;

const initialState: GameState = {
  camera: {
    toScene: 'SimpleScene',
  },
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<Camera>) => {
      state.camera = action.payload;
    },
  },
});

export const { navigate } = gameSlice.actions;

export const selectCamera = (state: RootState) => state.game.camera;

export default gameSlice.reducer;
