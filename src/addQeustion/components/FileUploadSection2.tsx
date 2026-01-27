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

/* ===============================
   CONSTANTS
================================ */
const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const ALLOWED_EXTENSIONS_TEXT = "PNG, JPG, JPEG, WEBP";

/* ===============================
   TYPES
================================ */
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

export default function FileUploadSection2() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  console.log("previewImage: ", previewImage);

  const [files, setFiles] = useState<UploadItem[]>([]);
  console.log("files: ", files);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  console.log("error: ", error);
  const [success, setSuccess] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

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

    const validFiles: UploadItem[] = [];
    const invalidFiles: string[] = [];

    Array.from(e.target.files).forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        invalidFiles.push(file.name);
        return;
      }

      validFiles.push({
        id: Date.now() + Math.random(),
        file,
        previewUrl: URL.createObjectURL(file),
      });
    });

    if (invalidFiles.length) {
      setError(
        `Unsupported image format detected.

Allowed formats: ${ALLOWED_EXTENSIONS_TEXT}

Please convert:
• ${invalidFiles.join("\n• ")}`,
      );
      return;
    }

    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.file.name));
      return [...prev, ...validFiles.filter((f) => !existing.has(f.file.name))];
    });

    setError(null);
    setSuccess(null);
    e.target.value = "";
  };
  const handleRemoveFile = async (id: number) => {
    const target = files.find((f) => f.id === id);
    if (!target) return;

    // Mark as deleting
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, deleting: true } : f)),
    );

    try {
      // 🔹 CASE 1: Local preview (not uploaded)
      if (target.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);

        setFiles((prev) => prev.filter((f) => f.id !== id));
        setSuccess("Image removed successfully");
        return;
      }

      // 🔹 CASE 2: Uploaded image → delete from server
      const key = extractS3KeyFromUrl(target.previewUrl!);
      if (!key) throw new Error("Invalid S3 key");

      const response = await fetch("http://localhost:5000/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.message || "Delete failed");
      }

      setFiles((prev) => prev.filter((f) => f.id !== id));
      setSuccess("Image deleted from server successfully");
    } catch (err) {
      setError("Failed to delete image. Please try again.");
      // rollback deleting state
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, deleting: false } : f)),
      );
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
    if (files.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    let endpoint = "";

    if (files.length === 1) {
      console.log("files.length: ", files.length);
      const first = files[0];
      if (!first) return;

      formData.append("file", first.file);
      endpoint = "http://localhost:5000/api/s3/upload/single";
    } else {
      console.log("files.length: ", files.length);
      files.forEach((item) => formData.append("files", item.file));
      endpoint = "http://localhost:5000/api/s3/upload/multiple";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error();

      const json = await response.json();

      /* ---- Normalize backend response ---- */
      let uploadedFiles: UploadedFile[] = [];

      if (files.length === 1) {
        const res = json as SingleUploadResponse;
        const selected = files[0];

        if (!res?.url || !selected) {
          throw new Error("Invalid single upload response");
        }

        uploadedFiles = [
          {
            originalName: selected.file.name,
            url: res.url,
          },
        ];
      } else {
        const res = json as MultipleUploadResponse;
        console.log("res: ", res);

        if (!Array.isArray(res.files)) {
          throw new Error("Invalid multiple upload response");
        }

        uploadedFiles = res.files;
        console.log("uploadedFiles: ", uploadedFiles);
        setFiles((prev) =>
          prev.map((item, index) => {
            const uploadedItem = uploadedFiles[index];

            if (!uploadedItem) return item;

            return {
              ...item,
              previewUrl: uploadedItem.url, // or uploadedItem.key
            };
          }),
        );
      }

      setSuccess("Images uploaded successfully.");
      setProgress(100);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDelete = async () => {
    if (pendingDeleteId === null) return;

    await handleRemoveFile(pendingDeleteId);

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
            Upload Images
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

        {files.length > 0 && (
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
                {files.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.file.name}</TableCell>

                    <TableCell>
                      {item.previewUrl?.startsWith("http") ? (
                        <>
                          <Link href={item.previewUrl} target="_blank">
                            View
                          </Link>
                          <Tooltip title="Copy link">
                            <IconButton
                              size="small"
                              onClick={() => handleCopyLink(item.previewUrl!)}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Typography variant="caption">Preview only</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Box
                        component="img"
                        src={item.previewUrl}
                        alt={item.file.name}
                        onClick={() => handlePreviewOpen(item.previewUrl)}
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
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => {
                          const isUploaded =
                            item.previewUrl?.startsWith("http");

                          // 🔹 Case 1: Local image (blob) → delete instantly
                          if (!isUploaded) {
                            handleRemoveFile(item.id);
                            return;
                          }

                          // 🔹 Case 2: Uploaded image → ask confirmation
                          setPendingDeleteId(item.id);
                          setConfirmOpen(true);
                        }}
                      >
                        {/* <CloseIcon fontSize="small" /> */}
                        {item.deleting ? (
                          <Typography variant="caption">Deleting…</Typography>
                        ) : (
                          <CloseIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {loading && (
          <Box>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption">{progress}%</Typography>
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
