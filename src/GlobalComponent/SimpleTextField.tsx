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
            sx={sx}
            fullWidth={fullWidth}
            type={type === "textarea" ? "text" : type}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            multiline={multiline || type === "textarea"}
            rows={multiline || type === "textarea" ? rows : undefined}
            error={!!fieldState.error}
            helperText={fieldState.error?.message || ""}
            value={typeof field.value === 'string' ? field.value || "" : Number(field.value) || 0}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (!(Number.isNaN(value)) && e.target.value.length === 0) {
                return field.onChange(e.target.value);
              } else if (Number.isNaN(value)) {
                return field.onChange(e.target.value);
              } else {
                return field.onChange(value);
              }
            }}
            {...rest}
            inputProps={
              isNumber
                ? { inputMode: "numeric", pattern: "[0-9]*" }
                : undefined
            }
          />
        )
      }}
    />
  );
};

export default SimpleTextField;
