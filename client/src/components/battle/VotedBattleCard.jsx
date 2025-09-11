import { Card } from "@/components/ui/card";

export function VotedBattleCard({ vote }) {
  if (!vote || !vote.battle) {
    return null;
  }

  const { battle, votedFor } = vote;
  const winner = battle.winner;

  const votedForBlog =
    battle.blog1?._id.toString() === votedFor.toString()
      ? battle.blog1
      : battle.blog2;

  const userVotedForWinner =
    winner &&
    votedForBlog &&
    winner._id.toString() === votedForBlog._id.toString();

  return (
    <Card className={`p-4 ${userVotedForWinner ? "bg-green-50" : "bg-red-50"}`}>
      <p className="font-bold text-sm">
        {battle.blog1?.title || "Silinmiş Blog"}
      </p>
      <p className="text-center font-bold text-xs my-1">VS</p>
      <p className="font-bold text-sm">
        {battle.blog2?.title || "Silinmiş Blog"}
      </p>
      <hr className="my-2" />
      <p className="text-xs text-gray-600">
        Oy Verdiğin:{" "}
        <span className="font-semibold">
          {votedForBlog?.title || "Silinmiş Blog"}
        </span>
      </p>
      <p className="text-xs text-gray-600">
        Kazanan:{" "}
        <span className="font-semibold">
          {winner ? winner.title || "Silinmiş Blog" : "Henüz Belirlenmedi"}
        </span>
      </p>
    </Card>
  );
}
