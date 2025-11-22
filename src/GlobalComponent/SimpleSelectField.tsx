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
  noneOption?: boolean
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
  noneOption = true,
}: SimpleSelectFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth={fullWidth} error={!!fieldState.error} disabled={disabled}>
          <InputLabel>{label}</InputLabel>

          <Select
            {...field}
            label={label}
            size="small"
            value={typeof field.value === "number" ? (field.value ? field.value : noneOption ? "" : 0) : field.value}
            slotProps={{
              root: {
                style: {
                  // maxHeight: '430px',
                  width: '100%'
                }
              }
            }}
            MenuProps={{
              style: {
                maxHeight: '430px',
                width: '100%'
              }
            }}
            onChange={(e) => {
              if (typeof e.target.value === 'number') {
                field.onChange(Number(e.target.value));
              } else {
                field.onChange(e.target.value);
              }
            }}
          >
            {noneOption && (<MenuItem value={0}>
              <i>none</i>
            </MenuItem>)}

            {options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>

          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl >
      )}
    />
  );
};

export default SimpleSelectField;
