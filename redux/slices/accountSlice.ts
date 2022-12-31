import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FriendRecord } from "../../components/types";

// Define a type for the slice state
interface StreamThingAccountState {
  accountInfoLoading: boolean;
  accountImageUploading: boolean;
  username: string | undefined;
  avatarUrl: string | undefined;
  friends: FriendRecord[] | undefined;
  friendRequests: string[];
}

const initialState: StreamThingAccountState = {
  accountInfoLoading: false,
  accountImageUploading: false,
  username: undefined,
  avatarUrl: undefined,
  friends: undefined,
  friendRequests: [],
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
    setAvatarUrl: (state, action: PayloadAction<string>) => {
      state.avatarUrl = action.payload;
    },
    setFriends: (state, action: PayloadAction<FriendRecord[]>) => {
      state.friends = action.payload;
    },
    setFriendRequests: (state, action: PayloadAction<string[]>) => {
      state.friendRequests = action.payload;
    },
  },
});

export const {
  setAccountInfoLoading,
  setAccountImageLoading,
  setUsername,
  setAvatarUrl,
  setFriends,
  setFriendRequests,
} = accountSlice.actions;

export default accountSlice.reducer;
