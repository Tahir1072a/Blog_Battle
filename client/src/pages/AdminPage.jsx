import { AdminPanel } from "@/components/admin/AdminPanel";
import { BattleManager } from "@/components/admin/BattleManager";

function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <AdminPanel />
      <BattleManager />
    </div>
  );
}

export default AdminPage;
