import { api } from "./baseApi.js";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    getProfile: builder.query({
      query: (args) => {
        const page = args?.page || 1;
        return `/users/profile?page=${page}`;
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } =
  authApi;
