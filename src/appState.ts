import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './state/store';
import { Immutable } from './state/types';

type AppState = Immutable<{
  needsUpdate: boolean;
}>;

const initialState: AppState = {
  needsUpdate: false,
};

export const updateSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    markNeedsUpdate: (state) => {
      state.needsUpdate = true;
    },
    markIsUpdated: (state) => {
      state.needsUpdate = false;
    },
  },
});

export const { markNeedsUpdate, markIsUpdated } = updateSlice.actions;
export const selectNeedsUpdate = (state: RootState) => state.app.needsUpdate;
export default updateSlice.reducer;
