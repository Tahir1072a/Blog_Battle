import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { useGetMyVotesQuery, useCastVoteMutation } from "@/store/api/battleApi";
import { VoteCard } from "./VoteCard";
import { VoteResults } from "./VoteResults";
import { VoteAnimation } from "./VoteAnimation";
import { ErrorMessage } from "@/components/common/ErrorMessage";

export function BattleArena({ initialBattle, onNextBattle, hasMoreBattles }) {
  const { data: myVotes = [], isLoading: votesLoading } = useGetMyVotesQuery(
    undefined,
    {
      skip: !useSelector(selectIsAuthenticated),
    }
  );

  const [castVote, { isLoading: voteLoading, error: voteError }] =
    useCastVoteMutation();

  const [voteResult, setVoteResult] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const hasVotedForBattle = useMemo(() => {
    if (!initialBattle || !myVotes.length) return false;
    return myVotes.some((vote) => vote.battle._id === initialBattle._id);
  }, [myVotes, initialBattle]);

  const isLoading = votesLoading || voteLoading;

  const handleVote = async (votedForBlogId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/battle" } } });
      return;
    }

    try {
      const result = await castVote({
        battleId: initialBattle._id,
        blogId: votedForBlogId,
      }).unwrap();

      setVoteResult(result);
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  if (votesLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Oy durumunuz kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (hasVotedForBattle || voteResult) {
    return (
      <VoteAnimation>
        <VoteResults
          battleResult={voteResult || initialBattle}
          onNextBattle={onNextBattle}
          hasMoreBattles={hasMoreBattles}
        />
      </VoteAnimation>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-4">Blog Savaşları</h1>
      <p className="text-center text-gray-500 mb-10">
        Hangi yazıyı daha çok beğendin? Tıkla ve oy ver!
      </p>

      {voteError && (
        <ErrorMessage
          message={
            voteError.data?.message || "Oylama sırasında bir hata oluştu."
          }
          className="mb-4"
        />
      )}

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        <VoteCard
          blog={initialBattle.blog1}
          onVote={handleVote}
          disabled={isLoading}
        />
        <div className="flex items-center font-bold text-2xl">VS</div>
        <VoteCard
          blog={initialBattle.blog2}
          onVote={handleVote}
          disabled={isLoading}
        />
      </div>

      {voteLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Oyunuz kaydediliyor...</span>
          </div>
        </div>
      )}
    </div>
  );
}
