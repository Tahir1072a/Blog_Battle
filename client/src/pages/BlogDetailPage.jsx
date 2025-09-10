import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/api";
import { BlogDetail } from "@/components/blog/BlogDetail";

function BlogDetailPage() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError("Blog yazısı yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return blog ? (
    <BlogDetail blog={blog} />
  ) : (
    <div className="text-center py-20">Blog yazısı bulunamadı.</div>
  );
}

export default BlogDetailPage;
