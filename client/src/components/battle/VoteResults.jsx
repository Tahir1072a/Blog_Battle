import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VoteResults({ battleResult, onNextBattle }) {
  const { blog1, blog2, blog1Votes, blog2Votes } = battleResult;
  const totalVotes = blog1Votes + blog2Votes;
  const blog1Percentage =
    totalVotes > 0 ? ((blog1Votes / totalVotes) * 100).toFixed(0) : 0;
  const blog2Percentage =
    totalVotes > 0 ? ((blog2Votes / totalVotes) * 100).toFixed(0) : 0;

  const ResultBar = ({ blog, percentage, votes }) => (
    <div className="w-full md:w-1/3 relative">
      <Card className="border-2 border-gray-300">
        <CardHeader>
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-56 object-cover rounded-t-lg"
          />
          <CardTitle className="mt-4">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full bg-gray-200 rounded-full h-8">
            <div
              className="bg-blue-600 h-8 rounded-full text-white flex items-center justify-center transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            >
              {percentage}%
            </div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-500">{votes} oy</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-10 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-4">Sonuçlar</h1>
      <p className="text-center text-gray-500 mb-10">
        Oyunuz için teşekkürler!
      </p>
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
        <ResultBar
          blog={blog1}
          percentage={blog1Percentage}
          votes={blog1Votes}
        />
        <div className="flex items-center font-bold text-2xl">VS</div>
        <ResultBar
          blog={blog2}
          percentage={blog2Percentage}
          votes={blog2Votes}
        />
      </div>

      <div className="text-center mt-12">
        <Button size="lg" onClick={onNextBattle}>
          Yeni Savaşa Geç
        </Button>
      </div>
    </div>
  );
}
