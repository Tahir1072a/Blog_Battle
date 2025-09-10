import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { VoteCard } from "./VoteCard";
import { VoteResults } from "./VoteResults";
import { VoteAnimation } from "./VoteAnimation";

export function BattleArena({ initialBattle, onNextBattle, hasMoreBattles }) {
  const [battle, setBattle] = useState(initialBattle);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfVoted = async () => {
      if (isAuthenticated && battle) {
        const { data: userVotes } = await api.get("/votes/my-votes");
        const hasVoted = userVotes.some(
          (vote) => vote.battle._id === battle._id
        );

        if (hasVoted) {
          setResult(battle);
        }
      }
    };
    checkIfVoted();
  }, [battle, isAuthenticated]);

  const handleVote = async (votedForBlogId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/battle" } } });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post(`/votes`, {
        battleId: battle._id,
        blogId: votedForBlogId,
      });
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Oylama sırasında bir hata oluştu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return (
      <VoteAnimation>
        <VoteResults
          battleResult={result}
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

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        <VoteCard
          blog={battle.blog1}
          onVote={handleVote}
          disabled={isLoading}
        />
        <div className="flex items-center font-bold text-2xl">VS</div>
        <VoteCard
          blog={battle.blog2}
          onVote={handleVote}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
