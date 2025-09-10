import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z
    .string()
    .min(10, { message: "Başlık en az 10 karakter olmalıdır." })
    .max(150, { message: "Başlık en fazla 150 karakter olabilir." }),
  content: z
    .string()
    .min(50, { message: "İçerik en az 50 karakter olmalıdır." }),
  imageUrl: z.url({ message: "Lütfen geçerli bir URL girin." }),
  category: z.string().min(2, { message: "Kategori alanı zorunludur." }),
});

export function BlogForm({
  onFormSubmit,
  isLoading,
  initialData = {},
  submitButtonText = "Yazıyı Gönder",
  onImageDrop,
  isUploadingImage,
  imagePreviewUrl,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      content: initialData.content || "",
      imageUrl: initialData.imageUrl || "",
      category: initialData.category || "",
    },
  });

  const onDrop = (acceptedFiles) => {
    if (onImageDrop) {
      onImageDrop(acceptedFiles, form);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
    multiple: false,
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{submitButtonText}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yazı Başlığı</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dikkat çekici bir başlık yazın..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Örn: Teknoloji, Gezi, Sanat..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Görsel</FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input {...getInputProps()} />
                      {isUploadingImage ? (
                        <p>Yükleniyor...</p>
                      ) : imagePreviewUrl ? (
                        <img
                          src={imagePreviewUrl}
                          alt="Önizleme"
                          className="max-h-48 mx-auto rounded-md"
                        />
                      ) : (
                        <p>
                          Görseli buraya sürükleyin veya seçmek için tıklayın
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İçerik</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Yazınızı buraya yazın..."
                      className="min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Gönderiliyor..." : submitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
