import React from "react";
import { Controller, Control } from "react-hook-form";
import { TextField } from "@mui/material";

interface SimpleTextFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  type?: "text" | "number" | "password" | "email" | "textarea";
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  rules?: object;
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
  ...rest
}) => {
  const isNumber = type === "number";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth={fullWidth}
          type={type === "textarea" ? "text" : type}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          multiline={multiline || type === "textarea"}
          rows={multiline || type === "textarea" ? rows : undefined}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ""}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(isNumber && value !== "" ? Number(value) : value);
          }}
          {...rest}
          inputProps={
            isNumber
              ? { inputMode: "numeric", pattern: "[0-9]*" }
              : undefined
          }
        />
      )}
    />
  );
};

export default SimpleTextField;
