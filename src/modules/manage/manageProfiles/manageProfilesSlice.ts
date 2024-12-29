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
    updateProfiles: (
      state,
      action: PayloadAction<{
        add: Profile[];
        modify: Profile[];
        remove: string[];
      }>
    ) => {
      const { add, modify, remove } = action.payload;
      let profiles = state.profiles
        .filter((profile) => !remove.includes(profile.id))
        .map((profile) => modify.find((p) => p.id === profile.id) || profile);

      for (const profile of add) {
        if (profiles.find((p) => p.id === profile.id)) {
          continue;
        }
        const indexToInsert = profiles.findIndex(
          (p) => p.name.localeCompare(profile.name) > 0
        );
        if (indexToInsert === -1) {
          profiles.push(profile);
        } else {
          profiles = [
            ...profiles.slice(0, indexToInsert),
            profile,
            ...profiles.slice(indexToInsert),
          ];
        }
      }
      state.profiles = profiles;
      state.loading = false;
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
