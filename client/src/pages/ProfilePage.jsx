import { useState } from "react";
import { useGetProfileQuery } from "@/store/api/authApi";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { UserProfileHeader } from "@/components/auth/UserProfileHeader";
import { UserProfile } from "@/components/auth/UserProfile";
import { useNavigate } from "react-router-dom";
import { useDeleteBlogMutation } from "@/store/api/blogApi";

function ProfilePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileQuery({ page: currentPage });

  const handleEdit = (blogId) => {
    navigate(`/blog/${blogId}/edit`);
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) {
      try {
        await deleteBlog(blogId).unwrap();
        // Başarılı olunca RTK Query otomatik olarak listeyi güncelleyecektir.
      } catch (err) {
        alert(
          "Yazı silinirken bir hata oluştu: " +
            (err.data?.message || err.message)
        );
      }
    }
  };

  if (isLoading) return <PageLoader text="Profiliniz Yükleniyor..." />;

  if (isError)
    return (
      <ErrorMessage
        message={
          error.data?.message ||
          "Profil verileriniz yüklenirken bir hata oluştu."
        }
        onRetry={refetch}
        fullPage
      />
    );

  if (!profileData) return null;

  const { user, myBlogs, votedBattles } = profileData;

  return (
    <div className="container mx-auto py-10 px-4">
      <UserProfileHeader user={user} />
      <UserProfile
        stats={user.levelInfo.stats}
        myBlogs={myBlogs}
        votedBattles={votedBattles}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ProfilePage;
