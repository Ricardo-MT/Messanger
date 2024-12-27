import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Universe } from "../../interfaces/universe";
import { RootState } from "../../store/store";

interface ClientState {
  universes: Universe[];
  universe?: Universe | null;
  loading: boolean;
  error: string;
}

const initialState: ClientState = {
  universe: null,
  universes: [],
  loading: true,
  error: "",
};

export const manageClientSlice = createSlice({
  name: "manageClient",
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

export const manageClientState = (state: RootState) => state.manageClient;
