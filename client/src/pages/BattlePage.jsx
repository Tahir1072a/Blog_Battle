// client/src/pages/BattlePage.jsx

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetActiveBattlesQuery,
  useCastVoteMutation,
  useGetMyVotesQuery,
} from "@/store/api/battleApi";
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
    isError,
    error,
    refetch,
  } = useGetActiveBattlesQuery();

  const [castVote, { isLoading: isVoting }] = useCastVoteMutation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const { data: myVotes = [] } = useGetMyVotesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [resultAfterVote, setResultAfterVote] = useState(null);

  const votedBattleIds = new Set(myVotes?.map((vote) => vote.battle._id));

  const handleVote = async (battleId, blogId) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/battle" } } });
      return;
    }

    try {
      const result = await castVote({ battleId, blogId }).unwrap();
      setResultAfterVote(result);
    } catch (err) {
      console.error("Oylama hatası:", err);
    }
  };

  const handleNext = () => {
    if (currentIndex < battles.length - 1) {
      setCurrentIndex((p) => p + 1);
      setResultAfterVote(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
      setResultAfterVote(null);
    }
  };

  const goToNextUnvotedBattle = () => {
    setResultAfterVote(null);

    for (let i = currentIndex + 1; i < battles.length; i++) {
      if (!votedBattleIds.has(battles[i]._id)) {
        setCurrentIndex(i);
        return;
      }
    }

    for (let i = 0; i < currentIndex; i++) {
      if (!votedBattleIds.has(battles[i]._id)) {
        setCurrentIndex(i);
        return;
      }
    }

    alert("Tebrikler! Tüm aktif savaşları oyladınız.");
  };

  const hasMoreBattles = () => {
    for (let i = currentIndex + 1; i < battles.length; i++) {
      if (!votedBattleIds.has(battles[i]._id)) {
        return true;
      }
    }

    for (let i = 0; i < currentIndex; i++) {
      if (!votedBattleIds.has(battles[i]._id)) {
        return true;
      }
    }

    return false;
  };

  if (isLoading) return <PageLoader text="Savaşlar Yükleniyor..." />;

  if (isError)
    return (
      <ErrorMessage
        message={
          error.data?.message || "Savaş verileri yüklenirken bir hata oluştu."
        }
        onRetry={refetch}
        fullPage
      />
    );

  if (battles.length === 0) {
    return (
      <ErrorMessage
        message="Gösterilecek aktif savaş bulunamadı."
        onRetry={refetch}
        fullPage
      />
    );
  }

  const currentBattle = battles[currentIndex];
  if (!currentBattle) {
    return (
      <ErrorMessage
        message="Savaş verisi bulunamadı. Lütfen sayfayı yenileyin."
        onRetry={refetch}
        fullPage
      />
    );
  }

  const hasVotedOrResultShown =
    votedBattleIds.has(currentBattle._id) || resultAfterVote;

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-2">Blog Savaşları</h1>
      <p className="text-center text-gray-500 mb-8 max-w-md">
        {hasVotedOrResultShown
          ? "İşte sonuçlar! Sonraki savaşa geçmek için butonu kullanın."
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

      {hasVotedOrResultShown ? (
        <VoteResults
          battleResult={resultAfterVote || currentBattle}
          onNextBattle={hasMoreBattles() ? goToNextUnvotedBattle : null}
          hasMoreBattles={hasMoreBattles()}
        />
      ) : (
        <SwipeableCard
          key={currentBattle._id}
          battle={currentBattle}
          onVote={(blogId) => handleVote(currentBattle._id, blogId)}
          disabled={isVoting}
        />
      )}
    </div>
  );
}

export default BattlePage;
