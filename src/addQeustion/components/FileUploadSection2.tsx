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
interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

interface UploadItem {
  id: number;
  file: File;
  previewUrl: string | undefined;
}

export default function FileUploadSection2() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<UploadItem[]>([]);
  console.log('files: ', files);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ===============================
  // HANDLE FILE SELECTION
  // ===============================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles: UploadItem[] = Array.from(e.target.files).map(
      (file, index) => ({
        id: Date.now() + index,
        file,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }),
    );

    setFiles(selectedFiles);
    setError(null);
    setSuccess(null);
  };

  // ===============================
  // CLEANUP OBJECT URLS
  // ===============================
  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [files]);
  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccess("Link copied to clipboard");
    } catch {
      setError("Failed to copy link");
    }
  };
  // ===============================
  // REMOVE FILE
  // ===============================
  const handleRemoveFile = (id: number) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // ===============================
  // UPLOAD
  // ===============================
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    files.forEach((item) => formData.append("files", item.file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error();

      const res: UploadResponse = await response.json();

      setSuccess("Files uploaded successfully.");
      setFiles([]);
      setProgress(100);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        {/* HEADER */}
        <Stack alignItems="center" spacing={1}>
          <CloudUploadOutlinedIcon
            sx={{ fontSize: 46, color: "primary.main" }}
          />
          <Typography variant="h6" fontWeight={600}>
            Upload Files
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Images are previewed instantly before upload.
          </Typography>
        </Stack>

        {/* FILE INPUT */}
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          Choose Files
        </Button>

        {/* TABLE PREVIEW */}
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
                      {item.previewUrl ? (
                        <>
                          <Link
                            href={item.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </Link>
                          {/* COPY BUTTON */}
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
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {item.previewUrl ? (
                        <Box
                          component="img"
                          src={item.previewUrl}
                          alt={item.file.name}
                          sx={{
                            width: 70,
                            height: 45,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile(item.id)}
                        disabled={loading}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* PROGRESS */}
        {loading && (
          <Box>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption">{progress}%</Typography>
          </Box>
        )}

        {/* ALERTS */}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* UPLOAD BUTTON */}
        <Button
          variant="contained"
          size="large"
          onClick={handleUpload}
          disabled={loading}
        >
          Upload
        </Button>
      </Stack>
    </Box>
  );
}
