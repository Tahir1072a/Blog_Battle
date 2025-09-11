import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WinnerBadge } from "./WinnerBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function BlogCard({ blog, showActions = false, onEdit, onDelete }) {
  const truncateContent = (text, length) => {
    if (text.length < length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <Card className="h-full flex flex-col relative">
      <Link
        to={`/blog/${blog._id}`}
        className="block hover:shadow-lg transition-shadow duration-300 flex-grow flex flex-col"
      >
        <WinnerBadge level={blog.round} />
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
            {truncateContent(blog.content, 60)}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-xs text-gray-500">
          <div>
            <p>Yazar: {blog.author?.name || "Bilinmiyor"}</p>
            <p className="font-bold text-blue-600">Seviye: {blog.round}</p>
          </div>
          <span className="font-semibold bg-gray-100 px-2 py-1 rounded">
            {blog.category}
          </span>
        </CardFooter>
      </Link>

      {showActions && (
        <div className="p-4 border-t flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onEdit(blog._id)}
          >
            <Pencil className="h-4 w-4 mr-2" /> Düzenle
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => onDelete(blog._id)}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Sil
          </Button>
        </div>
      )}
    </Card>
  );
}
