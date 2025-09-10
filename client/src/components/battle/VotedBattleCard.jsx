import { Card, CardContent } from "@/components/ui/card";

export function VotedBattleCard({ vote }) {
  const { battle, votedFor } = vote;
  const winner = battle.winner;
  const userVotedForWinner =
    winner && winner._id.toString() === votedFor.toString();

  return (
    <Card className={`p-4 ${userVotedForWinner ? "bg-green-50" : "bg-red-50"}`}>
      <p className="font-bold text-sm">{battle.blog1.title}</p>
      <p className="text-center font-bold text-xs my-1">VS</p>
      <p className="font-bold text-sm">{battle.blog2.title}</p>
      <hr className="my-2" />
      <p className="text-xs text-gray-600">
        Oy Verdiğin:{" "}
        <span className="font-semibold">
          {votedFor === battle.blog1._id
            ? battle.blog1.title
            : battle.blog2.title}
        </span>
      </p>
      <p className="text-xs text-gray-600">
        Kazanan:{" "}
        <span className="font-semibold">
          {winner ? winner.title : "Henüz Belirlenmedi"}
        </span>
      </p>
    </Card>
  );
}
