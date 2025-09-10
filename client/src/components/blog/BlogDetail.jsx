export function BlogDetail({ blog }) {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>Yazar: {blog.author?.name || "Bilinmiyor"}</span>
        <span className="mx-2">•</span>
        <span>Kategori: {blog.category}</span>
      </div>

      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}

      <div className="prose lg:prose-xl break-words whitespace-pre-wrap">
        {blog.content}
      </div>
    </div>
  );
}
