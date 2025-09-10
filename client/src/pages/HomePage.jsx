import { useState, useEffect } from "react";
import { BlogList } from "@/components/blog/BlogList";
import api from "@/utils/api";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get("/blogs");
        setBlogs(response.data);
      } catch (err) {
        setError("Blog yazıları yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">En Son Yazılar</h1>
      <BlogList blogs={blogs} />
    </div>
  );
}

export default HomePage;
