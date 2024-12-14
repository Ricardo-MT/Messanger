import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { Universe } from "../../interfaces/universe";

export interface UniverseListState {
  universes: Universe[];
  loading: boolean;
  error: string;
}

const initialState: UniverseListState = {
  universes: [],
  loading: false,
  error: "",
};

export const universeListSlice = createSlice({
  name: "universeList",
  initialState,
  reducers: {
    fetchUniverseList: (state) => {
      state.loading = true;
      state.error = "";
    },
    fetchUniverseListSuccess: (state, action: PayloadAction<Universe[]>) => {
      state.universes = action.payload;
      state.loading = false;
      state.error = "";
    },
    fetchUniverseListError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const universeListState = (state: RootState) => state.universeList;
