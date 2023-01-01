import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface StreamThingMainState {
  showGuide: boolean;
  showAuthModal: boolean;
  showAccountModal: boolean;
  showAddFriendModal: boolean;
  activeStream: string;
}

// Define the initial state using that type
const initialState: StreamThingMainState = {
  showGuide: false,
  showAuthModal: false,
  showAccountModal: false,
  showAddFriendModal: false,
  activeStream: "",
};

export const uiSlice = createSlice({
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
    setShowAddFriendModal: (state, action: PayloadAction<boolean>) => {
      state.showAddFriendModal = action.payload;
    },
    setActiveStream: (state, action: PayloadAction<string>) => {
      state.activeStream = action.payload;
    },
    resetUI: () => initialState,
  },
});

export const {
  setShowGuide,
  setShowAuthModal,
  setShowAccountModal,
  setShowAddFriendModal,
  setActiveStream,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
