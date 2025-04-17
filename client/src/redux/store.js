import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import managerReducer from "./slices/managerSlice";
import employerReducer from "./slices/employerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employer: employerReducer,
    manager: managerReducer,
  },
});

export default store;
