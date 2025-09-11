import { api } from "./baseApi.js";

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          if (params[key]) searchParams.append(key, params[key]);
        });
        const queryString = searchParams.toString();
        return `/blogs${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Blog", id: _id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    getSimilarBlogs: builder.query({
      query: ({ category, currentBlogId }) =>
        `/blogs?category=${category}&limit=3&exclude=${currentBlogId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Blog", id: _id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: "/blogs",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }, { type: "User" }],
    }),

    updateBlog: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        { type: "Blog", id: "LIST" },
        { type: "User" },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Blog", id: "LIST" },
        { type: "User" },
        { type: "Battle", id: "ACTIVE_LIST" },
      ],
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useGetSimilarBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUploadImageMutation,
} = blogApi;
