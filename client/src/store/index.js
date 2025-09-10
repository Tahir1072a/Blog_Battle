// client/src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logOut } from "./slices/authSlice.js";
import { api } from "./api/baseApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "api/executeQuery/pending",
          "api/executeQuery/fulfilled",
          "api/executeQuery/rejected",
        ],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

api.middleware.toString = () => "rtkQueryMiddleware";

// Custom middleware for handling 401 errors
const authMiddleware = (store) => (next) => (action) => {
  if (action.type?.endsWith("/rejected")) {
    const { payload } = action;
    if (payload?.status === 401) {
      store.dispatch(logOut());
      store.dispatch(api.util.resetApiState());
    }
  }
  return next(action);
};

export { useAppDispatch, useAppSelector } from "./hooks";

import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
