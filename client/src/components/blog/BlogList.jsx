import { BlogCard } from "./BlogCard";

export function BlogList({ blogs, ...props }) {
  if (!blogs || blogs.length === 0) {
    return (
      <p className="text-center text-gray-500">Henüz hiç blog yazısı yok.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} {...props} />
      ))}
    </div>
  );
}
