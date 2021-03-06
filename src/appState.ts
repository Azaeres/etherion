import { createSlice, AnyAction } from '@reduxjs/toolkit';
import { RootState } from './state/store';
import { Immutable } from './state/types';
import { PERSIST_REHYDRATE } from '@redux-offline/redux-offline/lib/constants';

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

function nonScopedReducer(state: RootState, action: AnyAction) {
  switch (action.type) {
    case PERSIST_REHYDRATE:
      console.log('PERSIST_REHYDRATE action caught  > action:', action);
      return { needsUpdate: false };
    default:
      return state;
  }
}

function combinedReducer(state: RootState, action: AnyAction) {
  return nonScopedReducer(updateSlice.reducer(state, action), action);
}

export const { markNeedsUpdate, markIsUpdated } = updateSlice.actions;
export const selectNeedsUpdate = (state: RootState) => state.app.needsUpdate;
export default combinedReducer;
