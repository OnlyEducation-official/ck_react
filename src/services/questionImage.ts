const BASE = import.meta.env.VITE_BASE_URL as string;

interface SingleUploadResponse {
  success: boolean;
  message: string;
  data: { url: string };
}

interface MultipleUploadResponse {
  success: boolean;
  message: string;
  data: { urls: string[] };
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

const urlToS3Key = (url: string): string => {
  const parsed = new URL(url);
  return parsed.pathname.startsWith("/")
    ? parsed.pathname.slice(1)
    : parsed.pathname;
};

const extractErrorMessage = async (
  res: Response,
  fallback: string,
): Promise<string> => {
  try {
    const body = (await res.json()) as { message?: string };
    return body?.message || fallback;
  } catch {
    return fallback;
  }
};

export async function uploadQuestionImage(
  file: File,
  signal?: AbortSignal,
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE}question-image`, {
    method: "POST",
    body: formData,
    signal,
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Image upload failed"));
  }

  const json = (await res.json()) as SingleUploadResponse;
  if (!json.success) {
    throw new Error(json.message || "Image upload failed");
  }
  return json.data.url;
}

export async function uploadMultipleQuestionImages(
  files: File[],
  signal?: AbortSignal,
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${BASE}multiple/question-images`, {
    method: "POST",
    body: formData,
    signal,
  });

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Images upload failed"));
  }

  const json = (await res.json()) as MultipleUploadResponse;
  if (!json.success) {
    throw new Error(json.message || "Images upload failed");
  }
  return json.data.urls;
}

export async function deleteQuestionImage(
  url: string,
  signal?: AbortSignal,
): Promise<void> {
  const key = urlToS3Key(url);
  const res = await fetch(
    `${BASE}question-images/${encodeURIComponent(key)}`,
    {
      method: "DELETE",
      signal,
    },
  );

  if (!res.ok) {
    throw new Error(await extractErrorMessage(res, "Delete failed"));
  }

  const json = (await res.json()) as DeleteResponse;
  if (!json.success) {
    throw new Error(json.message || "Delete failed");
  }
}
