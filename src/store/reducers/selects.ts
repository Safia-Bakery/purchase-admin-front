import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";
import { Language } from "@/utils/types";

interface State {
  lang: Language;
  sidebarToggler: boolean;
}

const initialState: State = {
  lang: Language.ru,
  sidebarToggler: false,
};

export const languageReducer = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state, { payload }: PayloadAction<Language>) => {
      state.lang = payload;
    },
    sidebarHandler: (state, { payload }: PayloadAction<boolean>) => {
      state.sidebarToggler = payload;
    },
  },
});

export const langSelector = (state: RootState) => state.language.lang;
export const toggleSidebar = (state: RootState) =>
  state.language.sidebarToggler;

export const { changeLanguage, sidebarHandler } = languageReducer.actions;
export default languageReducer.reducer;
