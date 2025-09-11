import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogList } from "@/components/blog/BlogList";
import { VotedBattleCard } from "@/components/battle/VotedBattleCard";
import { Trophy, FileText, BarChart2 } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";

export function UserProfile({
  stats,
  myBlogs,
  votedBattles,
  onPageChange,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const { votes, page, totalPages } = votedBattles;

  return (
    <>
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
            <BlogList
              blogs={myBlogs}
              showActions={true}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <p className="text-gray-500 mt-4">Henüz hiç yazı oluşturmadınız.</p>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">
            Oyladığım Savaşlar
          </h2>
          {votes && votes.length > 0 ? (
            <>
              <div className="space-y-4">
                {votes.map((vote) => (
                  <VotedBattleCard key={vote._id} vote={vote} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </>
          ) : (
            <p className="text-gray-500 mt-4">
              Henüz bir savaşa oy vermediniz.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
