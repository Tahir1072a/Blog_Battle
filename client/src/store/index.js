import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer, { logOut } from "./slices/authSlice.js";
import { api } from "./api/baseApi.js";

const authErrorMiddleware = (store) => (next) => (action) => {
  if (action.type?.endsWith("/rejected")) {
    const { payload } = action;
    if (payload?.status === 401) {
      console.log("Yetkisiz işlem, çıkış yapılıyor...");
      store.dispatch(logOut());
      store.dispatch(api.util.resetApiState());
    }
  }
  return next(action);
};

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
    })
      .concat(api.middleware)
      .concat(authErrorMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
