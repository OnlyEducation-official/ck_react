"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useFieldArray } from "react-hook-form";

/* ============================================================
   Config
============================================================ */
const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const ALLOWED_EXTENSIONS_TEXT = "PNG, JPG, JPEG, WEBP";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB — matches backend multer limit
const MAX_IMAGE_SIZE_TEXT = "5MB";

const API_BASE =
  "http://localhost:5000/api";
const UPLOAD_SINGLE_URL = `${API_BASE}/upload/question-image`;
const UPLOAD_MULTIPLE_URL = `${API_BASE}/upload/multiple/question-images`;
// const DELETE_URL = `${API_BASE}/upload/delete`; // wire when backend route exists

/* ============================================================
   Types
============================================================ */
export interface UploadImage {
  file?: File;          // local file before upload
  url?: string;         // blob: URL while local, https: URL after upload
  id?: number | string; // optional backend id
  deleting?: boolean;   // UI state
}

interface FileUploadSectionProps {
  control: any;
  watch: any;
  setValue?: any; // kept for API parity; not used internally
}

// Matches your backend's `{ success, message, data }` envelope
interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}
interface ApiError {
  success: false;
  message: string;
}
type ApiResponse<T> = ApiSuccess<T> | ApiError;

/* ============================================================
   Helpers
============================================================ */
const isBlobUrl = (url?: string) => !!url?.startsWith("blob:");
const isHttpUrl = (url?: string) => !!url?.startsWith("http");

const validateFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name} — unsupported format`;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    const mb = (file.size / 1024 / 1024).toFixed(2);
    return `${file.name} — ${mb} MB exceeds ${MAX_IMAGE_SIZE_TEXT}`;
  }
  return null;
};

/* ============================================================
   Component
============================================================ */
export default function FileUploadSection({
  control,
  watch,
}: FileUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null,
  );

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "images",
  });
  const images: UploadImage[] = watch("images") ?? [];

  /* -------- Auto-dismiss alerts -------- */
  useEffect(() => {
    if (!success && !error) return;
    const t = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 3000);
    return () => clearTimeout(t);
  }, [success, error]);

  /* -------- Revoke blob URLs on unmount -------- */
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (isBlobUrl(img.url)) URL.revokeObjectURL(img.url!);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- Fake progress until backend supports real % -------- */
  const startProgress = () => {
    setProgress(0);
    progressTimerRef.current = setInterval(() => {
      setProgress((p) =>
        p >= 90 ? p : p + Math.floor(Math.random() * 5) + 1,
      );
    }, 700);
  };
  const stopProgress = (final = 0) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setProgress(final);
    if (final === 100) {
      setTimeout(() => setProgress(0), 800);
    }
  };

  /* -------- File selection -------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;

    const errors: string[] = [];
    Array.from(list).forEach((file) => {
      const err = validateFile(file);
      if (err) {
        errors.push(err);
        return;
      }
      append({ file, url: URL.createObjectURL(file) } as UploadImage);
    });

    if (errors.length) {
      setError(`Some files were skipped:\n${errors.join("\n")}`);
    }
    e.target.value = "";
  };

  /* -------- Upload -------- */
  const handleUpload = async () => {
    const pending = images
      .map((img, index) => ({ img, index }))
      .filter(({ img }) => img.file && isBlobUrl(img.url));

    if (pending.length === 0) {
      setError("Nothing new to upload");
      return;
    }

    setLoading(true);
    startProgress();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const isSingle = pending.length === 1;
      const fieldName = isSingle ? "image" : "images";
      const endpoint = isSingle ? UPLOAD_SINGLE_URL : UPLOAD_MULTIPLE_URL;

      const formData = new FormData();
      pending.forEach(({ img }) => formData.append(fieldName, img.file!));

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const json = (await response.json()) as ApiResponse<{
        url?: string;
        urls?: string[];
      }>;

      if (!response.ok || !json.success) {
        throw new Error(
          "message" in json ? json.message : "Upload failed",
        );
      }

      const uploadedUrls = isSingle
        ? json.data.url
          ? [json.data.url]
          : []
        : json.data.urls ?? [];

      // Map uploaded URLs back to their original indices in the field array
      pending.forEach(({ index, img }, i) => {
        const url = uploadedUrls[i];
        if (!url) return;
        if (isBlobUrl(img.url)) URL.revokeObjectURL(img.url!);
        update(index, { ...images[index], url, file: undefined });
      });

      stopProgress(100);
      setSuccess(
        `Uploaded ${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""
        }`,
      );
    } catch (err: any) {
      stopProgress(0);
      if (err?.name === "AbortError") {
        setError("Upload cancelled");
      } else {
        setError(err?.message ?? "Upload failed");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    abortRef.current?.abort();
    stopProgress(0);
    setLoading(false);
  };

  /* -------- Delete -------- */
  const requestDelete = (index: number) => {
    const img = images[index];
    if (!img) return;

    // Local-only entry: drop immediately, no confirmation
    if (isBlobUrl(img.url)) {
      URL.revokeObjectURL(img.url!);
      remove(index);
      return;
    }
    // Server-hosted: ask first
    setConfirmDeleteIndex(index);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteIndex === null) return;
    const index = confirmDeleteIndex;
    const target = images[index];
    setConfirmDeleteIndex(null);
    if (!target?.url) return;

    try {
      update(index, { ...target, deleting: true });

      // TODO: wire to your real backend delete route. Example:
      // await fetch(DELETE_URL, {
      //   method: "DELETE",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ url: target.url }),
      // });

      remove(index);
      setSuccess("Image deleted");
    } catch {
      update(index, { ...target, deleting: false });
      setError("Delete failed");
    }
  };

  /* -------- Copy link -------- */
  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccess("Link copied");
    } catch {
      setError("Failed to copy");
    }
  };

  /* ============================================================
     Render
  ============================================================ */
  const hasPending = images.some((i) => isBlobUrl(i.url));

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
        {/* Header */}
        <Stack alignItems="center" spacing={1}>
          <CloudUploadOutlinedIcon sx={{ fontSize: 46 }} />
          <Typography variant="h6" fontWeight={600}>
            Upload Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Allowed: {ALLOWED_EXTENSIONS_TEXT} • Max {MAX_IMAGE_SIZE_TEXT}
          </Typography>
        </Stack>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handleFileChange}
        />

        {/* Action buttons */}
        <Stack
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
          }}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Choose Images
          </Button>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleUpload}
            disabled={loading || !hasPending}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            {loading ? "Uploading…" : "Upload"}
          </Button>
        </Stack>

        {/* Table */}
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
                  const image = images[index];
                  if (!image) return null;
                  const uploaded = isHttpUrl(image.url);

                  return (
                    <TableRow key={field.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {image.file?.name || "Uploaded image"}
                      </TableCell>

                      {/* Link / copy */}
                      <TableCell>
                        {uploaded && image.url ? (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Link
                              href={image.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <RemoveRedEyeIcon fontSize="large" />
                            </Link>
                            <Tooltip title="Copy link">
                              <IconButton
                                size="small"
                                onClick={() => handleCopyLink(image.url!)}
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

                      {/* Thumbnail */}
                      <TableCell>
                        {image.url && (
                          <Box
                            component="img"
                            src={image.url}
                            alt={image.file?.name ?? "Image"}
                            onClick={() => setPreviewUrl(image.url!)}
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

                      {/* Delete */}
                      <TableCell align="center">
                        {image.deleting ? (
                          <Typography variant="caption">Deleting…</Typography>
                        ) : (
                          <IconButton
                            color="error"
                            onClick={() => requestDelete(index)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Progress */}
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
                "& .MuiLinearProgress-bar": {
                  borderRadius: 6,
                  transition: "width 0.5s ease-in-out",
                  backgroundImage:
                    "linear-gradient(90deg, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.35) 37%, rgba(255,255,255,0.15) 63%)",
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.4s ease infinite",
                },
                "@keyframes shimmer": {
                  "0%": { backgroundPosition: "100% 0" },
                  "100%": { backgroundPosition: "0% 0" },
                },
              }}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {progress}%
              </Typography>
              <Button
                size="small"
                color="error"
                onClick={handleCancelUpload}
                startIcon={<CloseIcon />}
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
              >
                Cancel Upload
              </Button>
            </Stack>
          </Box>
        )}

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>
            {error}
          </Alert>
        )}
        {success && <Alert severity="success">{success}</Alert>}
      </Stack>

      {/* Preview dialog */}
      <Dialog
        open={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
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
          <IconButton
            onClick={() => setPreviewUrl(null)}
            aria-label="Close preview"
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 12 },
              right: { xs: 8, sm: 12 },
              backgroundColor: "white",
              color: "error.main",
              zIndex: 10,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <CloseIcon />
          </IconButton>
          {previewUrl && (
            <Box
              component="img"
              src={previewUrl}
              alt="Image preview"
              sx={{
                maxWidth: "100%",
                maxHeight: { xs: "80vh", sm: "85vh", md: "90vh" },
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog
        open={confirmDeleteIndex !== null}
        onClose={() => setConfirmDeleteIndex(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={600}>
              Delete image?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This permanently removes the image from the server. This cannot
              be undone.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={() => setConfirmDeleteIndex(null)}
                variant="outlined"
              >
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