import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootConfig";

interface State {
  token: string | null;
  lastUrl: string;
}

const initialState: State = {
  token: null,
  lastUrl: "/",
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutHandler: (state) => {
      state.token = null;
      const { pathname, search } = window.location;
      state.lastUrl = pathname + search;
    },
    loginHandler: (state, { payload }) => {
      state.token = payload;
    },
  },
});

export const tokenSelector = (state: RootState) => state?.auth?.token;
export const lastUrlSelector = (state: RootState) => state?.auth?.lastUrl;

export const { loginHandler, logoutHandler } = authReducer.actions;

export default authReducer.reducer;
