import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BlogCard({ blog }) {
  const truncateContent = (text, length) => {
    if (text.length < length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <Link
      to={`/blog/${blog._id}`}
      className="block hover:shadow-lg transition-shadow duration-300"
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <CardTitle className="mt-4">{blog.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600">
            {truncateContent(blog.content, 62)}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-gray-500">
          <span>Yazar: {blog.author?.name || "Bilinmiyor"}</span>
          <span className="font-semibold bg-gray-100 px-2 py-1 rounded">
            {blog.category}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
