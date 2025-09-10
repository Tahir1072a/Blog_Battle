import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { SwipeableCard } from "@/components/battle/SwipeableCard";
import { VoteResults } from "@/components/battle/VoteResults";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function BattlePage() {
  const {
    data: battles = [],
    isLoading,
    error,
    refetch,
  } = useGetActiveBattlesQuery();

  const [castVote, { isLoading: isVoting }] = useCastVoteMutation();

  const [votedBattleIds, setVotedBattleIds] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resultAfterVote, setResultAfterVote] = useState(null);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResultAfterVote(null);
    setCurrentIndex(0);
    try {
      const battlesRes = await api.get("/battles");
      const validBattles = battlesRes.data.filter(
        (battle) => battle.blog1 && battle.blog2
      );

      if (validBattles.length === 0) {
        setError("Şu anda oylama için geçerli bir savaş bulunmuyor.");
        setBattles([]);
      } else {
        setBattles(validBattles);
      }

      if (isAuthenticated) {
        const votesRes = await api.get("/votes/my-votes");
        const votedIds = new Set(votesRes.data.map((vote) => vote.battle._id));
        setVotedBattleIds(votedIds);
      }
    } catch (err) {
      setError("Savaş verileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleVote = async (battleId, blogId) => {
    try {
      await castVote({ battleId, blogId }).unwrap();
    } catch (err) {
      console.error("Oylama hatası:", err);
    }
  };

  const handleNext = () => {
    if (currentIndex < battles.length - 1) setCurrentIndex((p) => p + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  if (loading) return <PageLoader text="Savaşlar Yükleniyor..." />;
  if (error)
    return <ErrorMessage message={error} onRetry={fetchInitialData} fullPage />;

  if (resultAfterVote) {
    return (
      <VoteResults
        battleResult={resultAfterVote}
        onNextBattle={fetchInitialData}
        hasMoreBattles={true}
      />
    );
  }

  if (battles.length === 0) {
    return (
      <ErrorMessage
        message="Gösterilecek aktif savaş bulunamadı."
        onRetry={fetchInitialData}
        fullPage
      />
    );
  }

  const currentBattle = battles[currentIndex];
  const hasVoted = votedBattleIds.has(currentBattle._id);

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-2">Blog Savaşları</h1>
      <p className="text-center text-gray-500 mb-8 max-w-md">
        {hasVoted
          ? "Bu savaşa daha önce oy verdiniz. İşte sonuçlar:"
          : "Savaşlar arasında gezin, beğendiğin ikiliyi oyla!"}
      </p>

      <div className="w-full max-w-5xl flex justify-between items-center mb-4 px-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isVoting}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Önceki
        </Button>
        <span className="text-sm font-semibold text-gray-600 px-4 py-2 bg-gray-100 rounded-md">
          Savaş {currentIndex + 1} / {battles.length}
        </span>
        <Button
          onClick={handleNext}
          disabled={currentIndex >= battles.length - 1 || isVoting}
          variant="outline"
        >
          Sonraki <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {hasVoted ? (
        <VoteResults battleResult={currentBattle} onNextBattle={null} />
      ) : (
        <SwipeableCard
          key={currentBattle._id}
          battle={currentBattle}
          onVote={handleVote}
          disabled={isVoting}
        />
      )}
    </div>
  );
}

export default BattlePage;
