import { api } from "./baseApi.js";

export const battleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBattles: builder.query({
      query: () => "/battles",
      providesTags: [{ type: "Battle", id: "ACTIVE_LIST" }],
      pollingInterval: 30000,
    }),

    getActiveBattle: builder.query({
      query: () => "/battles/active",
      providesTags: [{ type: "Battle", id: "SINGLE" }],
    }),

    createBattle: builder.mutation({
      query: () => ({
        url: "/battles/create",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Battle", id: "ACTIVE_LIST" }],
    }),

    castVote: builder.mutation({
      query: ({ battleId, blogId }) => ({
        url: "/votes",
        method: "POST",
        body: { battleId, blogId },
      }),
      invalidatesTags: [
        { type: "Battle", id: "ACTIVE_LIST" },
        { type: "Vote", id: "MY_VOTES" },
      ],
      async onQueryStarted({ battleId, blogId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          battleApi.util.updateQueryData(
            "getActiveBattles",
            undefined,
            (draft) => {
              const battle = draft.find((b) => b._id === battleId);
              if (battle) {
                if (battle.blog1._id === blogId) {
                  battle.blog1Votes += 1;
                } else if (battle.blog2._id === blogId) {
                  battle.blog2Votes += 1;
                }
              }
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

    getMyVotes: builder.query({
      query: () => "/votes/my-votes",
      providesTags: [{ type: "Vote", id: "MY_VOTES" }],
    }),

    getAllBattlesAdmin: builder.query({
      query: (status = "active") => `/admin/battles?status=${status}`,
      providesTags: [{ type: "Battle", id: "ADMIN_LIST" }],
    }),

    createBattleManually: builder.mutation({
      query: () => ({
        url: "/admin/battles/create",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Battle", id: "ADMIN_LIST" },
        { type: "Battle", id: "ACTIVE_LIST" },
      ],
    }),

    resolveBattleManually: builder.mutation({
      query: (battleId) => ({
        url: `/admin/battles/${battleId}/resolve`,
        method: "POST",
      }),

      invalidatesTags: [
        { type: "Battle", id: "ADMIN_LIST" },
        { type: "Battle", id: "ACTIVE_LIST" },
        { type: "Blog", id: "LIST" },
        { type: "User" },
      ],
    }),
  }),
});

export const {
  useGetActiveBattlesQuery,
  useGetActiveBattleQuery,
  useCreateBattleMutation,
  useCastVoteMutation,
  useGetMyVotesQuery,
  useGetAllBattlesAdminQuery,
  useCreateBattleManuallyMutation,
  useResolveBattleManuallyMutation,
} = battleApi;
