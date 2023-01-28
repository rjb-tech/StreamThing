import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserRecord } from "../../components/types";

// Define a type for the slice state
interface StreamThingAccountState {
  accountInfoLoading: boolean;
  accountImageUploading: boolean;
  username: string | undefined;
  avatarUrl: string | undefined;
  followers: string[];
  following: UserRecord[];
  contentSources: string[];
  activeContentSource: string;
  channelCurrentlyViewing: string;
}

const initialState: StreamThingAccountState = {
  accountInfoLoading: false,
  accountImageUploading: false,
  username: undefined,
  avatarUrl: undefined,
  followers: [],
  following: [],
  contentSources: [],
  activeContentSource: "",
  channelCurrentlyViewing: "",
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
    setFollowers: (state, action: PayloadAction<string[]>) => {
      state.followers = action.payload;
    },
    setFollowing: (state, action: PayloadAction<UserRecord[]>) => {
      state.following = action.payload;
    },
    setContentSources: (state, action: PayloadAction<string[]>) => {
      state.contentSources = action.payload;
    },
    setActiveContentSource: (state, action: PayloadAction<string>) => {
      state.activeContentSource = action.payload;
    },
    setChannelCurrentlyViewing: (state, action: PayloadAction<string>) => {
      state.channelCurrentlyViewing = action.payload;
    },
    resetAccount: () => initialState,
  },
});

export const {
  setAccountInfoLoading,
  setAccountImageLoading,
  setUsername,
  setAvatarUrl,
  resetAccount,
  setFollowers,
  setFollowing,
  setContentSources,
  setActiveContentSource,
  setChannelCurrentlyViewing,
} = accountSlice.actions;

export default accountSlice.reducer;
