import React, { useState } from "react";
import { Controller, Control } from "react-hook-form";
import { Box, Button, LinearProgress, Typography, Avatar } from "@mui/material";

interface FileUploadProps {
  name: string;
  control: Control<any>;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ name, control, label }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const uploadFake = () => {
    // Fake upload progress animation
    setProgress(0);
    let val = 0;

    const interval = setInterval(() => {
      val += 10;
      setProgress(val);
      if (val >= 100) clearInterval(interval);
    }, 200);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Box>
          <Typography mb={1}>{label}</Typography>

          {/* PREVIEW */}
          {preview && (
            <Avatar
              src={preview}
              alt="preview"
              sx={{ width: 80, height: 80, mb: 1 }}
            />
          )}

          {/* INPUT BUTTON */}
          <Button variant="outlined" component="label">
            Upload Icon
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                // Set to RHF
                field.onChange(file);

                // Preview
                const url = URL.createObjectURL(file);
                setPreview(url);

                // Start fake upload progress
                uploadFake();
              }}
            />
          </Button>

          {/* PROGRESS BAR */}
          {progress > 0 && progress < 100 && (
            <Box mt={2}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography mt={1} variant="body2">
                {progress}%
              </Typography>
            </Box>
          )}

          {/* ERROR */}
          {fieldState.error && (
            <Typography color="error" variant="body2" mt={1}>
              {fieldState.error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default FileUpload;
