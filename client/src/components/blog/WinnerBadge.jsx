import { ShieldCheck } from "lucide-react";

/**
 * Belirli bir seviyeye göre farklı rozetler gösteren bileşen.
 * @param {{ level: number }} props
 */
export function WinnerBadge({ level }) {
  if (level < 3) {
    return null;
  }

  let badgeText = "";
  let badgeColor = "";

  if (level >= 10) {
    badgeText = "Efsane Kalem";
    badgeColor = "bg-yellow-500 text-white";
  } else if (level >= 5) {
    badgeText = "Usta Yazar";
    badgeColor = "bg-blue-500 text-white";
  } else if (level >= 3) {
    badgeText = "Yükselen Yıldız";
    badgeColor = "bg-green-500 text-white";
  }

  return (
    <div
      className={`absolute top-2 right-2 flex items-center px-2 py-1 rounded-full text-xs font-bold ${badgeColor}`}
    >
      <ShieldCheck className="h-4 w-4 mr-1" />
      {badgeText}
    </div>
  );
}
