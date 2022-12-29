import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./slices/accountSlice";
import mainSlice from "./slices/mainSlice";
import networkSlice from "./slices/networkSlice";

export const store = configureStore({
  reducer: {
    main: mainSlice,
    account: accountSlice,
    network: networkSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
