import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

interface ResetPasswordState {
  email: string;
  error: string;
  loading: boolean;
  success: boolean;
}

type ErrorPayload = { error: string };

const initialState: ResetPasswordState = {
  email: "",
  error: "",
  loading: false,
  success: false,
};

export const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    changeEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    submit: (state) => {
      state.error = "";
      state.loading = true;
    },
    success: (state) => {
      state.error = "";
      state.loading = false;
      state.success = true;
    },
    error: (state, action: PayloadAction<ErrorPayload>) => {
      state.error = action.payload.error;
      state.loading = false;
      state.success = false;
    },
  },
});

export const resetPasswordState = (state: RootState) => state.resetPassword;
