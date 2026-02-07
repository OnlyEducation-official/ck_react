"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
  Alert,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useFieldArray, useForm } from "react-hook-form";

/* ===============================
   CONSTANTS
================================ */
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
export const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export const ALLOWED_EXTENSIONS_TEXT = "PNG, JPG, JPEG, WEBP";

/* ===============================
   TYPES
================================ */
export interface UploadImage {
  file?: File;
  url?: string;
  previewUrl?: string;
  id?: number | string;
  uploading?: boolean;
  deleting?: boolean;
}
interface UploadItem {
  id: number;
  file: File;
  previewUrl?: string;
  deleting?: boolean;
}

/* ---- Backend responses ---- */
interface SingleUploadResponse {
  success: boolean;
  url: string;
  key: string;
}

interface UploadedFile {
  originalName: string;
  url: string;
}

interface MultipleUploadResponse {
  success: boolean;
  files: UploadedFile[];
}
interface QuestionImage {
  file?: File;
  url?: string;
  deleting?: boolean;
}

interface FormValues {
  question_image: QuestionImage[];
}

export interface UploadImage {
  /** Local file selected from input */
  file?: File;

  /** S3 or CDN URL after upload */
  url?: string;

  /** Preview URL (blob or remote) */
  previewUrl?: string;

  /** Backend identifier (optional) */
  id?: number | string;

  /** UI state */
  uploading?: boolean;
  deleting?: boolean;
}
const extractImageNameFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname; // e.g. "/images/1769261721937.webp"
    const parts = pathname.split("/").filter(Boolean);

    if (parts.length === 0) {
      return null;
    }

    const lastPart = parts.at(-1);
    return lastPart ?? null;
  } catch {
    return null;
  }
};
const extractS3KeyFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.startsWith("/")
      ? parsedUrl.pathname.slice(1) // remove leading '/'
      : parsedUrl.pathname;
  } catch {
    return null;
  }
};
interface FileUploadSection2Props {
  control: any;
  watch: any;
  setValue: any;
}

export default function FileUploadSection2({
  control,
  watch,
  setValue,
}: FileUploadSection2Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // console.log("previewImage: ", previewImage);

  // const [files, setFiles] = useState<UploadItem[]>([]);
  // console.log("files: ", files);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // console.log("error: ", error);
  const [success, setSuccess] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "question_image",
  });
  const startProgressAnimation = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Stop at 90% until upload finishes
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 1000);

    return interval;
  };
  const images = watch("question_image");
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  /* ===============================
     HANDLE FILE SELECTION
  ================================ */
  const handlePreviewOpen = (url?: string) => {
    if (!url) return;
    setPreviewImage(url);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const invalidFiles: string[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        invalidFiles.push(file.name);
        return;
      }

      append({
        file,
        url: URL.createObjectURL(file),
      });
    });

    if (invalidFiles.length) {
      setError(
        `Unsupported image format.\nAllowed: ${ALLOWED_EXTENSIONS_TEXT}\n${invalidFiles.join(", ")}`,
      );
    }

    e.target.value = "";
  };

  const handleRemove = async (index: number) => {
    const target = images[index];
    if (!target) return;

    // Local preview only
    if (target.url?.startsWith("blob:")) {
      URL.revokeObjectURL(target.url);
      remove(index);
      return;
    }

    try {
      update(index, { ...target, deleting: true });

      const key = extractS3KeyFromUrl(target.url!);

      await fetch(`${import.meta.env.VITE_AWS_BASE_URL}s3/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      remove(index);
      setSuccess("Image deleted");
    } catch {
      update(index, { ...target, deleting: false });
      setError("Delete failed");
    }
  };

  /* ===============================
     COPY LINK
  ================================ */
  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccess("Link copied to clipboard");
    } catch {
      setError("Failed to copy link");
    }
  };

  /* ===============================
     UPLOAD (SINGLE / MULTIPLE)
  ================================ */
  const handleUpload = async () => {
    if (!images?.length) {
      setError("Please select at least one image");
      return;
    }

    /**
     * 1️⃣ Extract pending images with original index
     *    (ONLY images that still need upload)
     */
    type PendingImage = {
      img: UploadImage;
      index: number;
    };

    const pendingImages: PendingImage[] = (images as UploadImage[])
      .map((img, index) => ({ img, index }))
      .filter(
        ({ img }) => !!img.file && !!img.url && img.url.startsWith("blob:"),
      );

    if (pendingImages.length === 0) {
      setError("All images are already uploaded");
      return;
    }

    setLoading(true);
    const progressInterval = startProgressAnimation();

    try {
      const formData = new FormData();

      /**
       * 2️⃣ Build FormData based on pending count
       */
      if (pendingImages.length === 1) {
        formData.append("file", pendingImages[0]?.img.file as File);
      } else {
        pendingImages.forEach(({ img }) => {
          formData.append("files", img.file as File);
        });
      }

      /**
       * 3️⃣ Select API dynamically
       */
      const endpoint =
        pendingImages.length === 1
          ? `${import.meta.env.VITE_AWS_BASE_URL}s3/upload/single`
          : `${import.meta.env.VITE_AWS_BASE_URL}s3/upload/multiple`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();

      /**
       * 4️⃣ Normalize backend response
       */
      type UploadedResult = {
        url: string;
        id?: string;
      };

      const uploadedResults: UploadedResult[] =
        pendingImages.length === 1
          ? [{ url: json.url, id: json.id }]
          : json.files;

      /**
       * 5️⃣ Map uploaded URLs back to correct form indices
       *    (FIXES bug case 4)
       */
      pendingImages.forEach(({ index }, i) => {
        const uploaded = uploadedResults[i];
        if (!uploaded) return;

        update(index, {
          ...images[index],
          url: uploaded.url,
          id: uploaded.id,
          file: undefined, // 🚫 prevents re-upload
        });
      });
      // ✅ Finish progress cleanly
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
      setSuccess("Images uploaded successfully");
    } catch (err) {
      console.error(err);
      setProgress(0);
      setError("Upload failed");
    } finally {
      clearInterval(progressInterval);

      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (pendingDeleteId === null) return;

    await handleRemove(pendingDeleteId);

    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  /* ===============================
     UI
  ================================ */
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 4,
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack spacing={3}>
        <Stack alignItems="center" spacing={1}>
          <CloudUploadOutlinedIcon sx={{ fontSize: 46 }} />
          <Typography variant="h6" fontWeight={600}>
            Upload Images three
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Allowed formats: {ALLOWED_EXTENSIONS_TEXT}
          </Typography>
        </Stack>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handleFileChange}
        />
        <Stack
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
          }}
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => inputRef.current?.click()}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Choose Images
          </Button>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Upload
          </Button>
        </Stack>

        {fields.length > 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Image Link</TableCell>
                  <TableCell>Preview</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {fields.map((field, index) => {
                  const image = images?.[index];
                  // console.log("image: ", image);
                  if (!image) return null;

                  const isUploaded = image.url?.startsWith("http");

                  return (
                    <TableRow key={field.id}>
                      <TableCell>{index + 1}</TableCell>

                      {/* Name */}
                      <TableCell>
                        {image.file?.name || "Uploaded Image"}
                      </TableCell>

                      {/* Image Link */}
                      <TableCell>
                        {isUploaded && image.url ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Link href={image.url} target="_blank">
                              <RemoveRedEyeIcon fontSize="large" />
                            </Link>

                            <Tooltip title="Copy link">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleCopyLink(image.url ? image.url : "")
                                }
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Typography variant="caption">
                            Preview only
                          </Typography>
                        )}
                      </TableCell>

                      {/* Preview */}
                      <TableCell>
                        {image.url && (
                          <Box
                            component="img"
                            src={image.url}
                            alt={image.file?.name ?? "Image"}
                            onClick={() => handlePreviewOpen(image.url)}
                            sx={{
                              width: 70,
                              height: 45,
                              objectFit: "cover",
                              borderRadius: 1,
                              cursor: "zoom-in",
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        )}
                      </TableCell>

                      {/* Action */}
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemove(index)}
                        >
                          {image.deleting ? (
                            <Typography variant="caption">Deleting…</Typography>
                          ) : (
                            <CloseIcon fontSize="small" />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {loading && progress > 0 && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 6,
                overflow: "hidden",
                backgroundColor: "grey.300",

                // bar animation
                "& .MuiLinearProgress-bar": {
                  borderRadius: 6,
                  transition: "width 0.6s ease-in-out",

                  // shimmer animation
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.35) 37%, rgba(255,255,255,0.15) 63%)",
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.4s ease infinite",
                },

                "@keyframes shimmer": {
                  "0%": {
                    backgroundPosition: "100% 0",
                  },
                  "100%": {
                    backgroundPosition: "0% 0",
                  },
                },
              }}
            />

            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: "block",
                textAlign: "right",
                fontWeight: 500,
                transition: "opacity 0.3s ease",
              }}
            >
              {progress}%
            </Typography>
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Stack>
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent
          sx={{
            position: "relative",
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          {/* 🔴 Close Button */}
          <IconButton
            onClick={handlePreviewClose}
            aria-label="Close preview"
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 12 },
              right: { xs: 8, sm: 12 },
              backgroundColor: "white",
              color: "error.main",
              zIndex: 10,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* 🖼 Image */}
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              alt="Image preview"
              sx={{
                maxWidth: "100%",
                maxHeight: {
                  xs: "80vh",
                  sm: "85vh",
                  md: "90vh",
                },
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Delete Image?
            </Typography>

            <Typography variant="body2" color="text.secondary">
              This action will permanently delete the image from the server.
              This cannot be undone.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleCancelDelete} variant="outlined">
                Cancel
              </Button>

              <Button
                onClick={handleConfirmDelete}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
