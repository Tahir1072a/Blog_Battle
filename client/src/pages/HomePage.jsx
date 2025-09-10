import { useState, useEffect } from "react";
import { BlogList } from "@/components/blog/BlogList";
import api from "@/utils/api";

function HomePage() {
  const { data: blogs = [], isLoading, error, refetch } = useGetBlogsQuery();

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Bloglar yükleniyor..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Blog yazıları yüklenirken bir hata oluştu."
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
