import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { SwipeableCard } from "@/components/battle/SwipeableCard";
import { VoteResults } from "@/components/battle/VoteResults";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

function BattlePage() {
  const [battles, setBattles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  const fetchBattles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/battles");

      // HATA DÜZELTME: API'den gelen savaşları, her iki blogu da
      // geçerli olanlarla filtreleyelim. Bu, silinmiş bloglara
      // referans veren bozuk savaş verilerini ayıklar.
      const validBattles = data.filter(
        (battle) => battle.blog1 && battle.blog2
      );

      if (validBattles.length === 0) {
        setError("Şu anda oylama için geçerli bir savaş bulunmuyor.");
        setBattles([]);
      } else {
        setBattles(validBattles);
      }
    } catch (err) {
      setError("Savaş verileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  const handleVote = async (votedForBlogId) => {
    if (isVoting) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/battle" } } });
      return;
    }

    setIsVoting(true);
    setError(null);

    try {
      const response = await api.post(`/votes`, {
        battleId: battles[currentIndex]._id,
        blogId: votedForBlogId,
      });
      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Oylama sırasında bir hata oluştu."
      );
    } finally {
      setIsVoting(false);
    }
  };

  const handleNextBattle = () => {
    setResult(null);
    if (currentIndex < battles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setError("Tebrikler! Tüm aktif savaşları oyladınız.");
      setBattles([]);
    }
  };

  if (loading) {
    return <PageLoader text="Savaşlar Yükleniyor..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchBattles} fullPage />;
  }

  if (result) {
    return (
      <VoteResults
        battleResult={result}
        onNextBattle={handleNextBattle}
        hasMoreBattles={currentIndex < battles.length - 1}
      />
    );
  }

  if (battles.length === 0 || !battles[currentIndex]) {
    return (
      <ErrorMessage
        message="Gösterilecek aktif savaş bulunamadı."
        onRetry={fetchBattles}
        fullPage
      />
    );
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-2">Blog Savaşları</h1>
      <p className="text-center text-gray-500 mb-8 max-w-md">
        Hangi yazıyı daha çok beğendin? Beğendiğini sağa, diğerini sola
        kaydırarak oy ver!
      </p>
      <SwipeableCard
        key={battles[currentIndex]._id}
        battle={battles[currentIndex]}
        onVote={handleVote}
        disabled={isVoting}
      />
    </div>
  );
}

export default BattlePage;
