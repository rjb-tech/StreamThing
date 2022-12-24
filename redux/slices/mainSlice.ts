import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface StreamThingMainState {
  showGuide: boolean;
  activeNetwork: string;
  activeStream: string;
}

// Define the initial state using that type
const initialState: StreamThingMainState = {
  showGuide: false,
  activeNetwork: "",
  activeStream: "",
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setShowGuide: (state, action: PayloadAction<boolean>) => {
      state.showGuide = action.payload;
    },
    setActiveNetwork: (state, action: PayloadAction<string>) => {
      state.activeNetwork = action.payload;
    },
    setActiveStream: (state, action: PayloadAction<string>) => {
      state.activeStream = action.payload;
    },
  },
});

export const { setShowGuide, setActiveNetwork, setActiveStream } =
  mainSlice.actions;

export default mainSlice.reducer;
