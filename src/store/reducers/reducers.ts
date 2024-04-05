import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import language from "./selects";

export default combineReducers({
  auth,
  language,
});
