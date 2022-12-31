import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface StreamThingMainState {
  showGuide: boolean;
  showAuthModal: boolean;
  showAccountModal: boolean;
  activeStream: string;
}

// Define the initial state using that type
const initialState: StreamThingMainState = {
  showGuide: false,
  showAuthModal: false,
  showAccountModal: false,
  activeStream: "",
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setShowGuide: (state, action: PayloadAction<boolean>) => {
      state.showGuide = action.payload;
    },
    setShowAuthModal: (state, action: PayloadAction<boolean>) => {
      state.showAuthModal = action.payload;
    },
    setShowAccountModal: (state, action: PayloadAction<boolean>) => {
      state.showAccountModal = action.payload;
    },
    setActiveStream: (state, action: PayloadAction<string>) => {
      state.activeStream = action.payload;
    },
  },
});

export const {
  setShowGuide,
  setShowAuthModal,
  setShowAccountModal,
  setActiveStream,
} = mainSlice.actions;

export default mainSlice.reducer;
