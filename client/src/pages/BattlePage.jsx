import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { BattleArena } from "@/components/battle/BattleArena";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function BattlePage() {
  const [battles, setBattles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveBattles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/battles");
      if (data.length === 0) {
        setError("Şu anda oylama için aktif bir savaş bulunmuyor.");
      }
      setBattles(data);
    } catch (err) {
      setError("Savaş verileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveBattles();
  }, [fetchActiveBattles]);

  const goToNextBattle = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % battles.length);
  };

  const goToPrevBattle = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + battles.length) % battles.length
    );
  };

  if (loading)
    return <div className="text-center py-20">Savaşlar Yükleniyor...</div>;
  if (error)
    return <div className="text-center py-20 text-yellow-600">{error}</div>;
  if (battles.length === 0)
    return <div className="text-center py-20">Aktif Savaş Bulunamadı.</div>;

  const currentBattle = battles[currentIndex];

  return (
    <div className="relative">
      <BattleArena
        key={currentBattle._id}
        initialBattle={currentBattle}
        onNextBattle={goToNextBattle}
        hasMoreBattles={battles.length > 1}
      />
      {battles.length > 1 && (
        <>
          <Button
            onClick={goToPrevBattle}
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={goToNextBattle}
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <ChevronRight />
          </Button>
        </>
      )}
    </div>
  );
}

export default BattlePage;
