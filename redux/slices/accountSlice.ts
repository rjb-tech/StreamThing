import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface StreamThingAccountState {
  accountInfoLoading: boolean;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

const initialState: StreamThingAccountState = {
  accountInfoLoading: false,
  username: null,
  fullName: null,
  avatarUrl: null,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountInfoLoading: (state, action: PayloadAction<boolean>) => {
      state.accountInfoLoading = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    setAvatarUrl: (state, action: PayloadAction<string>) => {
      state.avatarUrl = action.payload;
    },
  },
});

export const { setAccountInfoLoading, setUsername, setFullName, setAvatarUrl } =
  accountSlice.actions;

export default accountSlice.reducer;
