"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
  Alert,
  Grid,
  IconButton,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";

interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

interface PreviewFile {
  file: File;
  previewUrl: string | undefined;
}

export default function FileUploadSection() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<PreviewFile[]>([]);
  console.log('files: ', files);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles: PreviewFile[] = Array.from(e.target.files).map(
      (file) => ({
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

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [files]);

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
    files.forEach(({ file }) => formData.append("files", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

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
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => {
      const fileToRemove = prev[index];

      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 560,
        mx: "auto",
        p: 4,
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1} alignItems="center">
          <CloudUploadOutlinedIcon
            sx={{ fontSize: 46, color: "primary.main" }}
          />
          <Typography variant="h6" fontWeight={600}>
            Upload Files
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Images show preview instantly. Other files upload normally.
          </Typography>
        </Stack>

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

        {/* IMAGE PREVIEW GRID */}
        {files.length > 0 && (
          <Grid container spacing={2}>
            {files.map((item, index) => (
              <Grid size={4} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    height: 90,
                  }}
                >
                  {/* REMOVE BUTTON */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(index)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      zIndex: 2,
                      backgroundColor: "rgba(255,255,255,0.6)",
                      color: "red",
                      border: "2px solid",
                      borderColor: "#e0e0e0",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.8)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  {/* IMAGE OR FILE */}
                  {item.previewUrl ? (
                    <Box
                      component="img"
                      src={item.previewUrl}
                      alt={item.file.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        textAlign: "center",
                        px: 1,
                      }}
                    >
                      {item.file.name}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {loading && (
          <Box>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption">{progress}%</Typography>
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

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
