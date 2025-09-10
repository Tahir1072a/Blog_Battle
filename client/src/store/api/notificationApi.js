import { api } from "./baseApi.js";

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: [{ type: "Notification", id: "LIST" }],
      pollingInterval: 60000,
    }),

    markNotificationsAsRead: builder.mutation({
      query: () => ({
        url: "/notifications/read",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData(
            "getNotifications",
            undefined,
            (draft) => {
              draft.forEach((notification) => {
                notification.isRead = true;
              });
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationsAsReadMutation } =
  notificationApi;
