import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { Universe } from "../../interfaces/universe";
import { Profile } from "../../interfaces/profile";

interface UniverseState {
  shouldRefresh: boolean;
  universe: Universe | null;
  universes: Universe[];
  profile: Profile | null;
  error: string;
  loading: boolean;
}

const initialState: UniverseState = {
  shouldRefresh: true,
  universe: null,
  universes: [],
  profile: null,
  error: "",
  loading: true,
};

export const universeSlice = createSlice({
  name: "universe",
  initialState,
  reducers: {
    setUniverses: (state, action: PayloadAction<Universe[]>) => {
      state.universes = action.payload;
    },
    setUniverse: (state, action: PayloadAction<Universe | null>) => {
      state.universe = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
      state.shouldRefresh = action.payload === null;
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
    reset: (state) => {
      state.universe = null;
      state.universes = [];
      state.profile = null;
      state.error = "";
      state.loading = true;
    },
  },
});

export const universeState = (state: RootState) => state.universe;
