import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface StreamThingMainState {
  showGuide: boolean;
}

// Define the initial state using that type
const initialState: StreamThingMainState = {
  showGuide: false,
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setShowGuide: (state, action: PayloadAction<boolean>) => {
      state.showGuide = action.payload;
    },
  },
});

export const { setShowGuide } = mainSlice.actions;

export default mainSlice.reducer;
