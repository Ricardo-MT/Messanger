import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "../modules/login/loginSlice";
import { authSlice } from "../contexts/authSlice";
import { resetPasswordSlice } from "../modules/resetPassword/resetPasswordSlice";
import { universeListSlice } from "../modules/home/universeListSlice";
import { universeSlice } from "../modules/universe/universeSlice";
import { chatSlice } from "../modules/universe/chat/chatSlice";
import { manageUniversesSlice } from "../modules/manage/manageUniversesSlice";
import { manageProfilesSlice } from "../modules/manage/manageProfiles/manageProfilesSlice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    auth: authSlice.reducer,
    resetPassword: resetPasswordSlice.reducer,
    universeList: universeListSlice.reducer,
    universe: universeSlice.reducer,
    chat: chatSlice.reducer,
    manageUniverses: manageUniversesSlice.reducer,
    manageProfiles: manageProfilesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
