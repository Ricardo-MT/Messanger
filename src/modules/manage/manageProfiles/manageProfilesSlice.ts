import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../../interfaces/profile";
import { RootState } from "../../../store/store";

interface ManageProfileState {
  profiles: Profile[];
  loading: boolean;
  error: string;
}

const initialState: ManageProfileState = {
  profiles: [],
  loading: true,
  error: "",
};

export const manageProfilesSlice = createSlice({
  name: "manageProfiles",
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
    success: (state) => {
      state.error = "";
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    startLoading: (state) => {
      state.loading = true;
    },
  },
});

export const manageProfilesState = (state: RootState) => state.manageProfiles;
