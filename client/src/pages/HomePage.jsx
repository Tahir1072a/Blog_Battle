import { BlogList } from "@/components/blog/BlogList";
import { useGetBlogsQuery } from "@/store/api/blogApiSlice";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

function HomePage() {
  const {
    data: blogs,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBlogsQuery();

  if (isLoading) {
    return <PageLoader text="Yazılar yükleniyor..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error.data?.message || "Blog yazıları yüklenirken bir hata oluştu."
        }
        onRetry={refetch}
        fullPage
      />
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">En Son Yazılar</h1>
      <BlogList blogs={blogs} />
    </div>
  );
}

export default HomePage;
