import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../modules/login/loginSlice";
import { authSlice } from "../contexts/authSlice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
