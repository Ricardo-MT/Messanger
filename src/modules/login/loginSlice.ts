import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

interface LoginState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
}

type LoginField = "email" | "password";
type FieldPayload = { field: LoginField; value: string };
type ErrorPayload = { error: string };

const initialState: LoginState = {
  email: "",
  password: "",
  error: "",
  loading: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    field: (state, action: PayloadAction<FieldPayload>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    submit: (state) => {
      state.error = "";
      state.loading = true;
    },
    success: (state) => {
      state.error = "";
      state.loading = false;
    },
    error: (state, action: PayloadAction<ErrorPayload>) => {
      state.error = action.payload.error;
      state.loading = false;
    },
  },
});

export const loginState = (state: RootState) => state.login;
