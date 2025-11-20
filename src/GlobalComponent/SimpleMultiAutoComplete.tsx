import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";

export type Option = {
  value: string | number;
  label: string;
};

type MUIAutoProps<
  T extends FieldValues,
  Multiple extends boolean | undefined
> = Omit<
  AutocompleteProps<Option, Multiple, false, false>,
  "renderInput" | "multiple" | "onChange" | "value" | "options"
>;

interface SimpleMultiAutoCompleteProps<T extends FieldValues>
  extends MUIAutoProps<T, true> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: Option[];
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>; // <-- FIXED HERE
}

const SimpleMultiAutoComplete = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  fullWidth = true,
  disabled = false,
  rules,
  ...autocompleteProps
}: SimpleMultiAutoCompleteProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules} // <-- Explicitly correct type
      render={({ field, fieldState }) => (
        <FormControl fullWidth={fullWidth} error={!!fieldState.error}>
          <Autocomplete
            {...autocompleteProps}
            multiple
            disableCloseOnSelect
            options={options}
            disabled={disabled}
            value={options?.filter((opt) => field.value?.includes(opt.value)) || []}
            getOptionLabel={(opt) => opt.label}
            onChange={(_, selectedOptions) => {
              const values = selectedOptions.map((opt) =>
                typeof opt.value === "string" && !isNaN(Number(opt.value))
                  ? Number(opt.value)
                  : opt.value
              );
              field.onChange(values);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                size="small"
                error={!!fieldState.error}
              />
            )}
          />

          {fieldState.error && (
            <FormHelperText>{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SimpleMultiAutoComplete;
