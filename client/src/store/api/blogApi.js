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

    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: "/blogs",
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
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
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
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
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useUploadImageMutation,
} = blogApi;
