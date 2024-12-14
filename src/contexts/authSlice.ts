import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { RootState } from "../store/store";
import { authApp } from "../settings/firebaseApp";

interface AuthState {
  user?: User | null;
  loading: boolean;
}

type UserPayload = { user: User };

const initialState: AuthState = {
  user: authApp.currentUser,
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserPayload>) => {
      state.user = action.payload.user;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const authState = (state: RootState) => state.auth;
