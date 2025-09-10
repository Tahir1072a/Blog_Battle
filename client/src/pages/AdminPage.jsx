import { useState, useEffect, useCallback } from "react";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, PlusCircle, CheckCircle } from "lucide-react";

function AdminPage() {
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBattles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/battles?status=active");
      setBattles(data);
    } catch (err) {
      setError("Aktif savaşlar yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBattles();
  }, [fetchBattles]);

  const handleCreateBattle = async () => {
    setActionLoading(true);
    try {
      await api.post("/admin/battles/create");
      alert("Yeni savaş başarıyla oluşturuldu!");
      fetchBattles(); // Listeyi yenile
    } catch (err) {
      alert(
        "Savaş oluşturulurken hata: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveBattle = async (battleId) => {
    setActionLoading(true);
    try {
      await api.post(`/admin/battles/${battleId}/resolve`);
      alert(`Savaş başarıyla sonlandırıldı!`);
      fetchBattles(); // Listeyi yenile
    } catch (err) {
      alert(
        "Savaş sonlandırılırken hata: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoader text="Admin verileri yükleniyor..." />;
  if (error)
    return <ErrorMessage message={error} onRetry={fetchBattles} fullPage />;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <Button onClick={handleCreateBattle} disabled={actionLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> Yeni Savaş Oluştur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="w-5 h-5" /> Aktif Savaşlar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {battles.length > 0 ? (
            <div className="space-y-4">
              {battles.map((battle) => (
                <div
                  key={battle._id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-semibold">{battle.blog1.title}</p>
                    <p className="text-sm text-gray-500">vs</p>
                    <p className="font-semibold">{battle.blog2.title}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolveBattle(battle._id)}
                    disabled={actionLoading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Sonlandır
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Aktif savaş bulunmuyor.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPage;
