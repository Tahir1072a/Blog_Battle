import {
  useGetAllBattlesAdminQuery,
  useResolveBattleManuallyMutation,
} from "@/store/api/battleApi";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, CheckCircle } from "lucide-react";

export function BattleManager() {
  const {
    data: battles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllBattlesAdminQuery("active");

  const [resolveBattle, { isLoading: isResolving }] =
    useResolveBattleManuallyMutation();

  const handleResolveBattle = async (battleId) => {
    try {
      await resolveBattle(battleId).unwrap();
      alert(`Savaş başarıyla sonlandırıldı!`);
    } catch (err) {
      alert(
        "Savaş sonlandırılırken hata: " + (err.data?.message || err.message)
      );
    }
  };

  if (isLoading) return <PageLoader text="Savaşlar yükleniyor..." />;

  if (isError)
    return (
      <ErrorMessage
        message={
          error.data?.message || "Aktif savaşlar yüklenirken bir hata oluştu."
        }
        onRetry={refetch}
        fullPage
      />
    );

  return (
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
                  <p className="font-semibold">
                    {battle.blog1?.title || "Yazı Yüklenemedi"}
                  </p>
                  <p className="text-sm text-gray-500">vs</p>
                  <p className="font-semibold">
                    {battle.blog2?.title || "Yazı Yüklenemedi"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolveBattle(battle._id)}
                  disabled={isResolving}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isResolving ? "Sonlandırılıyor..." : "Sonlandır"}
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
  );
}
