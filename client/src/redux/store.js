import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import employerReducer from "./slices/employerSlice";
import managerReducer from "./slices/managerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employer: employerReducer,
    manager: managerReducer,
  },
});

export default store;