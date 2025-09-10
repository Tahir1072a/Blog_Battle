import { useParams } from "react-router-dom";
import {
  useGetBlogByIdQuery,
  useGetSimilarBlogsQuery,
} from "@/store/api/blogApi";
import { BlogDetail } from "@/components/blog/BlogDetail";
import { BlogList } from "@/components/blog/BlogList";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

const SimilarBlogsSection = ({ category, currentBlogId }) => {
  const { data: similarBlogs, isLoading } = useGetSimilarBlogsQuery({
    category,
    currentBlogId,
  });

  if (isLoading || !similarBlogs || similarBlogs.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Benzer Yazılar</h2>
      <BlogList blogs={similarBlogs} />
    </div>
  );
};

function BlogDetailPage() {
  const { id } = useParams();

  const {
    data: blog,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBlogByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return <PageLoader text="Yazı yükleniyor..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error.data?.message || "Blog yazısı yüklenirken bir hata oluştu."
        }
        onRetry={refetch}
        fullPage
      />
    );
  }

  if (!blog) {
    return <ErrorMessage message="Blog yazısı bulunamadı." fullPage />;
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <BlogDetail blog={blog} />
      <SimilarBlogsSection category={blog.category} currentBlogId={blog._id} />
    </div>
  );
}

export default BlogDetailPage;
