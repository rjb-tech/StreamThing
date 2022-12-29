import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface StreamThingNetworkState {
  id: string | undefined;
  name: string | undefined;
  members: string[] | undefined;
  admins: string[] | undefined;
  logoUrl: string | undefined;
  owner: string | undefined;
}

const initialState: StreamThingNetworkState = {
  id: undefined,
  name: undefined,
  members: undefined,
  admins: undefined,
  logoUrl: undefined,
  owner: undefined,
};

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setNetworkId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setNetworkName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setNetworkMembers: (state, action: PayloadAction<string[]>) => {
      state.members = action.payload;
    },
    setNetworkAdmins: (state, action: PayloadAction<string[]>) => {
      state.admins = action.payload;
    },
    setNetworkLogoUrl: (state, action: PayloadAction<string>) => {
      state.logoUrl = action.payload;
    },
    setNetworkOwner: (state, action: PayloadAction<string>) => {
      state.owner = action.payload;
    },
  },
});

export const {
  setNetworkId,
  setNetworkName,
  setNetworkMembers,
  setNetworkAdmins,
  setNetworkLogoUrl,
  setNetworkOwner,
} = networkSlice.actions;

export default networkSlice.reducer;
