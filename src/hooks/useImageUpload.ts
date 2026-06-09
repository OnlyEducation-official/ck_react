import { useCallback, useState } from "react";
import {
  deleteQuestionImage,
  uploadMultipleQuestionImages,
  uploadQuestionImage,
} from "@/services/questionImage";

export function useImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File, signal?: AbortSignal): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        return await uploadQuestionImage(file, signal);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Image upload failed";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const uploadImages = useCallback(
    async (files: File[], signal?: AbortSignal): Promise<string[]> => {
      setLoading(true);
      setError(null);
      try {
        return await uploadMultipleQuestionImages(files, signal);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Images upload failed";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteImage = useCallback(
    async (url: string, signal?: AbortSignal): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await deleteQuestionImage(url, signal);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Delete failed";
        setError(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { uploadImage, uploadImages, deleteImage, loading, error };
}
