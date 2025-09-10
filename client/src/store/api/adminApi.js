import { api } from "./baseApi.js";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => "/admin/users",
      providesTags: [{ type: "User", id: "ADMIN_LIST" }],
    }),

    getUserStats: builder.query({
      query: (userId) => `/admin/users/${userId}/stats`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),

    getSystemStats: builder.query({
      query: () => "/admin/stats",
      providesTags: ["SystemStats"],
    }),

    bulkAction: builder.mutation({
      query: ({ action, targets, data }) => ({
        url: `/admin/bulk/${action}`,
        method: "POST",
        body: { targets, data },
      }),
      invalidatesTags: ["Blog", "Battle", "User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserStatsQuery,
  useGetSystemStatsQuery,
  useBulkActionMutation,
} = adminApi;
