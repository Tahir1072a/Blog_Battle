import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "@/utils/api";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { BlogList } from "@/components/blog/BlogList";
import { VotedBattleCard } from "@/components/battle/VotedBattleCard";

function ProfilePage() {
  const currentUser = useSelector(selectCurrentUser);
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [votedBattles, setVotedBattles] = useState([]);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        setLoading(true);
        const blogsRes = await api.get("/blogs/myblogs");
        setMyBlogs(blogsRes.data);
        const votesRes = await api.get("/votes/my-votes");
        setVotedBattles(votesRes.data);
      } catch (err) {
        setError("Verileriniz yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyData();
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Yazılarım</h2>
          {myBlogs.length > 0 ? (
            <BlogList blogs={myBlogs} />
          ) : (
            <p className="text-gray-500 mt-4">Henüz hiç yazı oluşturmadınız.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">
            Oyladığım Savaşlar
          </h2>
          {votedBattles.length > 0 ? (
            <div className="space-y-4">
              {votedBattles.map((vote) => (
                <VotedBattleCard key={vote._id} vote={vote} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              Henüz bir savaşa oy vermediniz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
