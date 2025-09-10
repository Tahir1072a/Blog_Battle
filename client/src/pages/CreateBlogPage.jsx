// client/src/pages/CreateBlogPage.jsx

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BlogForm } from "@/components/blog/BlogForm";
import {
  useCreateBlogMutation,
  useUploadImageMutation,
} from "@/store/api/blogApi";
import { ErrorMessage } from "@/components/common/ErrorMessage";

function CreateBlogPage() {
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageDrop = useCallback(
    async (acceptedFiles, form) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const result = await uploadImage(formData).unwrap();

        const fullImageUrl = `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
        }${result.imageUrl}`;

        setImagePreview(fullImageUrl);
        form.setValue("imageUrl", fullImageUrl, { shouldValidate: true });
      } catch (err) {
        const errorMessage =
          err.data?.message || "Görsel yüklenirken bir hata oluştu.";
        setError(errorMessage);
      }
    },
    [uploadImage]
  );

  const handleCreateBlog = async (data) => {
    if (!data.imageUrl) {
      setError("Lütfen bir görsel yükleyin.");
      return;
    }

    try {
      await createBlog(data).unwrap();
      navigate("/profile");
    } catch (err) {
      setError(err.data?.message || "Blog oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <div className="flex justify-center py-10 bg-gray-50">
      <div className="w-full px-4">
        <BlogForm
          onFormSubmit={handleCreateBlog}
          isLoading={isCreating || isUploading}
          submitButtonText="Yazıyı Oluştur"
          onImageDrop={handleImageDrop}
          isUploadingImage={isUploading}
          imagePreviewUrl={imagePreview}
        />
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-4">
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateBlogPage;
