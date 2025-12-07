// SingleSelectAuto.tsx
import { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from "react-hook-form";

type Option = {
  value: string | number;
  label: string;
};

type SingleSelectAutoProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  options: Option[];
  externalValue?: string | number | null;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function SingleSelectAuto<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
  rules,
  disabled = false,
  fullWidth = true,
  externalValue,
}: SingleSelectAutoProps<TFieldValues>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  useEffect(() => {
    if (
      externalValue === undefined ||
      externalValue === null ||
      options.length === 0
    ) {
      return;
    }

    // only update if different
    if (field.value !== externalValue) {
      field.onChange(externalValue);
    }
  }, [externalValue, options, field.value, field.onChange]);

  // 2) Fallback: if no externalValue but options exist and field is empty,
  //    auto-select the first option
  useEffect(() => {
    if (
      (externalValue !== undefined && externalValue !== null) ||
      options.length === 0
    ) {
      return;
    }

    const hasValue =
      field.value !== undefined && field.value !== null && field.value !== "";

    if (!hasValue) {
      field.onChange(options?.[0]?.value);
    }
  }, [options, externalValue, field.value, field.onChange]);

  const value =
    field.value !== undefined && field.value !== null ? field.value : "";

  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!fieldState.error}
      disabled={disabled}
      size="small"
    >
      <InputLabel>{label}</InputLabel>
      <Select
        {...field}
        label={label}
        value={value}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
        MenuProps={{
          style: { maxHeight: 430, width: "100%" },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      {fieldState.error && (
        <FormHelperText>{fieldState.error.message}</FormHelperText>
      )}
    </FormControl>
  );
}
