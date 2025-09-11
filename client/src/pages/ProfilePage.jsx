import { useState } from "react";
import { useGetProfileQuery } from "@/store/api/authApi";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { UserProfileHeader } from "@/components/auth/UserProfileHeader";
import { UserProfile } from "@/components/auth/UserProfile";

function ProfilePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProfileQuery({ page: currentPage });

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
      />
    </div>
  );
}

export default ProfilePage;
