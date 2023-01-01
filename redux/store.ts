import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./slices/accountSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    account: accountSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
