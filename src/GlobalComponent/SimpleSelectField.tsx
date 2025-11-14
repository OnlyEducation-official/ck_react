import React from "react";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

export type Option = {
  value: string | number;
  label: string;
};

interface SimpleSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  rules?: RegisterOptions; // ✅ support validation rules
  isOptionEqualToValue?: (a: Option, b: Option) => boolean; // ✅ optional prop
}

const SimpleSelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  disabled = false,
  fullWidth = true,
  rules,
}: SimpleSelectFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth={fullWidth} error={!!fieldState.error} disabled={disabled}>
          {label && (<InputLabel>{label}</InputLabel>)}

          <Select
            {...field}
            label={label}
            value={field.value ? field.value : ""}
            onChange={(e) => field.onChange(Number(e.target.value))}
          >
            <MenuItem value={0}>
              <i>none</i>
            </MenuItem>

            {options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SimpleSelectField;
