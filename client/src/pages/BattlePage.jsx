import { useState, useEffect } from "react";
import api from "@/utils/api";
import { BattleArena } from "@/components/battle/BattleArena";

function BattlePage() {
  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveBattle = async () => {
      try {
        setLoading(true);
        const response = await api.get("/battles/active");
        setBattle(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Şu anda oylama için aktif bir savaş bulunmuyor.");
        } else {
          setError("Savaş verisi yüklenirken bir hata oluştu.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveBattle();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Aktif Savaş Aranıyor...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-yellow-600">{error}</div>;
  }

  return battle ? (
    <BattleArena initialBattle={battle} />
  ) : (
    <div className="text-center py-20">Bir şeyler ters gitti.</div>
  );
}

export default BattlePage;
