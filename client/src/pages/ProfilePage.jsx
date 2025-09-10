import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "@/utils/api";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { BlogList } from "@/components/blog/BlogList";

function ProfilePage() {
  const currentUser = useSelector(selectCurrentUser);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/blogs/myblogs");
        setMyBlogs(data);
      } catch (err) {
        setError("Yazılarınız yüklenirken bir hata oluştu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col items-center mb-12">
        <img
          src="/assets/images/default-avatar.png"
          alt="Profil"
          className="w-24 h-24 rounded-full mb-4 border-4 border-gray-200"
        />
        <h1 className="text-4xl font-bold">{currentUser?.name}</h1>
        <p className="text-gray-500">{currentUser?.email}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Yazılarım</h2>
        {loading ? (
          <p>Yazılarınız yükleniyor...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <BlogList blogs={myBlogs} />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
