import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Universe } from "../../interfaces/universe";
import { RootState } from "../../store/store";

interface ManageUniverses {
  universes: Universe[];
  universe?: Universe | null;
  loading: boolean;
  error: string;
}

const initialState: ManageUniverses = {
  universe: null,
  universes: [],
  loading: true,
  error: "",
};

export const manageUniversesSlice = createSlice({
  name: "manageUniverses",
  initialState,
  reducers: {
    setUniverse: (
      state,
      action: PayloadAction<Universe | null | undefined>
    ) => {
      state.universe = action.payload;
    },
    setUniverses: (state, action) => {
      state.universes = action.payload;
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

export const manageUniversesState = (state: RootState) => state.manageUniverses;
