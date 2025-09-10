import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BlogForm } from "@/components/blog/BlogForm";
import api from "@/utils/api";

function CreateBlogPage() {
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageDrop = useCallback(async (acceptedFiles, form) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fullImageUrl = `${import.meta.env.VITE_API_BASE_URL}${
        res.data.imageUrl
      }`;

      setImagePreview(fullImageUrl);
      form.setValue("imageUrl", fullImageUrl, { shouldValidate: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Görsel yüklenirken bir hata oluştu.";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleCreateBlog = async (data) => {
    try {
      await createBlog(data).unwrap();
      navigate("/");
    } catch (err) {
      setError(err.data?.message || "Bir hata oluştu.");
    }
  };

  const handleImageUpload = async (files) => {
    const formData = new FormData();
    formData.append("image", files[0]);

    try {
      const result = await uploadImage(formData).unwrap();
      return result.imageUrl;
    } catch (err) {
      throw new Error("Görsel yüklenemedi");
    }
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50">
      <div className="w-full px-4">
        <BlogForm
          onFormSubmit={handleCreateBlog}
          isLoading={isLoading || isUploading} // Hem form hem görsel yükleme durumunu kontrol et
          submitButtonText="Yazıyı Oluştur"
          // Form'a gerekli state ve fonksiyonları props olarak geçiyoruz
          onImageDrop={handleImageDrop}
          isUploadingImage={isUploading}
          imagePreviewUrl={imagePreview}
        />
        {error && (
          <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md w-full max-w-2xl mx-auto text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateBlogPage;
