import React from "react";
import { Controller, Control } from "react-hook-form";
import { SxProps, TextField } from "@mui/material";
import { Theme } from "@emotion/react";

interface SimpleTextFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  type?: "text" | "number" | "password" | "email" | "textarea";
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  rules?: object;
  sx?: SxProps<Theme>; // ✅ Proper MUI type
}

const SimpleTextField: React.FC<SimpleTextFieldProps> = ({
  name,
  control,
  label,
  type = "text",
  placeholder,
  disabled = false,
  multiline = false,
  rows = 3,
  fullWidth = true,
  rules,
  sx,
  ...rest
}) => {
  const isNumber = type === "number";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <TextField
            size="small"
            {...field}
            sx={{
              ...sx,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#fafafa",
                transition: "all 0.25s ease",

                "& fieldset": {
                  borderColor: "#D0D5DD",
                },

                "&:hover fieldset": {
                  borderColor: "#B8BDC5",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  boxShadow: "0 0 0 3px rgba(25,118,210,0.25)",
                },

                "&.Mui-error fieldset": {
                  borderColor: "#d32f2f",
                  boxShadow: "0 0 0 3px rgba(211,47,47,0.25)",
                },
              },

              // Input spacing & font
              "& .MuiInputBase-input": {
                padding: "10px 12px",
                fontSize: "0.9rem",
                fontWeight: 500,
              },

              // Label styling
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "text.secondary",
              },

              "& .MuiInputLabel-root.Mui-focused": {
                color: "primary.main",
              },

              // Error text
              "& .MuiFormHelperText-root": {
                marginLeft: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
              },

              // Textarea padding
              "& .MuiInputBase-inputMultiline": {
                padding: "12px !important",
                lineHeight: "1.5rem",
              },
            }}
            fullWidth={fullWidth}
            type={type === "textarea" ? "text" : type}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            multiline={multiline || type === "textarea"}
            rows={multiline || type === "textarea" ? rows : undefined}
            error={!!fieldState.error}
            helperText={fieldState.error?.message || ""}
            value={
              typeof field.value === "string"
                ? field.value || ""
                : Number(field.value) || 0
            }
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!Number.isNaN(value) && e.target.value.length === 0) {
                return field.onChange(e.target.value);
              } else if (Number.isNaN(value)) {
                return field.onChange(e.target.value);
              } else {
                return field.onChange(value);
              }
            }}
            {...rest}
            inputProps={
              isNumber ? { inputMode: "numeric", pattern: "[0-9]*" } : undefined
            }
          />
        );
      }}
    />
  );
};

export default SimpleTextField;
