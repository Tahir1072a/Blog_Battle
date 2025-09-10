import { useParams } from "react-router-dom";
import { useGetBlogByIdQuery } from "@/store/api/blogApi";
import { BlogDetail } from "@/components/blog/BlogDetail";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

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

  return blog ? (
    <BlogDetail blog={blog} />
  ) : (
    <ErrorMessage message="Blog yazısı bulunamadı." fullPage />
  );
}

export default BlogDetailPage;
