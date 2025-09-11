import { useParams, useNavigate } from "react-router-dom";
import {
  useGetBlogByIdQuery,
  useUpdateBlogMutation,
} from "@/store/api/blogApi";
import { BlogForm } from "@/components/blog/BlogForm";
import { PageLoader } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: blog, isLoading: isFetching } = useGetBlogByIdQuery(id);
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const handleUpdateBlog = async (data) => {
    try {
      await updateBlog({ id, ...data }).unwrap();
      navigate("/profile");
    } catch (err) {
      alert(
        "Blog güncellenirken bir hata oluştu: " +
          (err.data?.message || err.message)
      );
    }
  };

  if (isFetching) return <PageLoader text="Blog verileri yükleniyor..." />;
  if (!blog)
    return <ErrorMessage message="Düzenlenecek blog bulunamadı." fullPage />;

  return (
    <div className="flex justify-center py-10 bg-gray-50">
      <div className="w-full px-4">
        <BlogForm
          onFormSubmit={handleUpdateBlog}
          isLoading={isUpdating}
          initialData={blog}
          submitButtonText="Yazıyı Güncelle"
          imagePreviewUrl={blog.imageUrl}
        />
      </div>
    </div>
  );
}

export default EditBlogPage;
