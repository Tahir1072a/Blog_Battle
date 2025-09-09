import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logOut } from "./slices/authSlice.js";
import api from "../utils/api.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Diğer slice'lar buraya eklenecek
  },
  devTools: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logOut());
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
