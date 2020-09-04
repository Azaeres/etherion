import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';
import { Immutable } from '../../state/types';

type GameState = Immutable<{
  camera: object;
}>;

const initialState: GameState = {
  camera: {},
};

export default {};

// export const updateSlice = createSlice({
//   name: 'app',
//   initialState,
//   reducers: {
//     markNeedsUpdate: (state) => {
//       state.needsUpdate = true;
//     },
//     markIsUpdated: (state) => {
//       state.needsUpdate = false;
//     },
//   },
// });

// export const { markNeedsUpdate, markIsUpdated } = updateSlice.actions;
// export const selectNeedsUpdate = (state: RootState) => state.app.needsUpdate;
// export default updateSlice.reducer;
