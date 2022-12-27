import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface StreamThingAccountState {
  accountInfoLoading: boolean;
  accountImageUploading: boolean;
  username: string | undefined;
  fullName: string | undefined;
  avatarUrl: string | undefined;
}

const initialState: StreamThingAccountState = {
  accountInfoLoading: false,
  accountImageUploading: false,
  username: undefined,
  fullName: undefined,
  avatarUrl: undefined,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountInfoLoading: (state, action: PayloadAction<boolean>) => {
      state.accountInfoLoading = action.payload;
    },
    setAccountImageLoading: (state, action: PayloadAction<boolean>) => {
      state.accountImageUploading = action.payload;
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

export const {
  setAccountInfoLoading,
  setAccountImageLoading,
  setUsername,
  setFullName,
  setAvatarUrl,
} = accountSlice.actions;

export default accountSlice.reducer;
