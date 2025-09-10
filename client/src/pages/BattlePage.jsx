import { useState, useEffect } from "react";
import api from "@/utils/api";
import { BattleArena } from "@/components/battle/BattleArena";

function BattlePage() {
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveBattle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/battles/active");
      setBattle(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setBattle(null);
        setError("Şu anda oylama için aktif bir savaş bulunmuyor.");
      } else {
        setError("Savaş verisi yüklenirken bir hata oluştu.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveBattle();
  }, [fetchActiveBattle]);

  if (loading) {
    return <div className="text-center py-20">Aktif Savaş Aranıyor...</div>;
  }

  if (error || !battle) {
    return (
      <div className="text-center py-20 text-yellow-600">
        {error || "Aktif savaş bulunamadı."}
      </div>
    );
  }

  return (
    <BattleArena initialBattle={battle} onNextBattle={fetchActiveBattle} />
  );
}

export default BattlePage;
