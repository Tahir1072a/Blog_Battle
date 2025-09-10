import { useState, useEffect } from "react";
import api from "@/utils/api";
import { BlogList } from "@/components/blog/BlogList";
import { VotedBattleCard } from "@/components/battle/VotedBattleCard";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, FileText, BarChart2 } from "lucide-react";

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users/profile");
        setProfileData(data);
      } catch (err) {
        setError("Profil verileriniz yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) return <PageLoader text="Profiliniz Yükleniyor..." />;
  if (error) return <ErrorMessage message={error} fullPage />;
  if (!profileData) return null;

  const { user, myBlogs, votedBattles } = profileData;
  const { levelInfo } = user;
  const stats = levelInfo.stats;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
        <img
          src="/assets/images/default-avatar.jpg"
          alt="Profil"
          className="w-24 h-24 rounded-full border-4 border-gray-200"
        />
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-2 text-lg font-semibold text-blue-600 flex items-center gap-2">
            <span>{levelInfo.badge}</span>
            <span>
              {levelInfo.name} (Seviye {levelInfo.level})
            </span>
          </div>
        </div>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5" /> İstatistiklerim
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <FileText className="w-8 h-8 mx-auto text-gray-500 mb-2" />
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
            <p className="text-sm text-gray-600">Toplam Yazı</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{stats.totalWins}</p>
            <p className="text-sm text-gray-600">Kazanılan Savaş</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <BarChart2 className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{stats.winRate}%</p>
            <p className="text-sm text-gray-600">Kazanma Oranı</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Yazılarım</h2>
          {myBlogs.length > 0 ? (
            <div className="space-y-4">
              <BlogList blogs={myBlogs} />
            </div>
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
