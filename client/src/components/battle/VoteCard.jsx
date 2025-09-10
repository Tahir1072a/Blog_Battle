import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VoteCard({ blog, onVote, disabled }) {
  return (
    <div
      className={`w-full md:w-1/3 cursor-pointer transition-transform duration-300 ${
        disabled ? "opacity-50" : "hover:scale-105"
      }`}
      onClick={() => !disabled && onVote(blog._id)}
    >
      <Card className="h-full flex flex-col border-2 hover:border-blue-500 relative">
        <WinnerBadge level={blog.round} />
        <CardHeader>
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-56 object-cover rounded-t-lg"
          />
          <CardTitle className="mt-4">{blog.title}</CardTitle>
          <p className="text-sm font-semibold text-blue-700 pt-2">
            Seviye: {blog.round}
          </p>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="prose lg:prose-xl break-words whitespace-pre-wrap">
            {blog.content.substring(0, 150)}...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
