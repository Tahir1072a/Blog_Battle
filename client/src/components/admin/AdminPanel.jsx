import { useCreateBattleManuallyMutation } from "@/store/api/battleApi";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function AdminPanel() {
  const [createBattle, { isLoading: isCreating }] =
    useCreateBattleManuallyMutation();

  const handleCreateBattle = async () => {
    try {
      await createBattle().unwrap();
      alert("Yeni savaş başarıyla oluşturuldu!");
    } catch (err) {
      alert("Savaş oluşturulurken hata: " + (err.data?.message || err.message));
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Admin Paneli</h1>
      <Button onClick={handleCreateBattle} disabled={isCreating}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {isCreating ? "Oluşturuluyor..." : "Yeni Savaş Oluştur"}
      </Button>
    </div>
  );
}
