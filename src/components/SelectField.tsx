import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  CircularProgress,
  Checkbox,
  ListItemText,
} from "@mui/material";

import { Controller, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

type Option = {
  id: number;
  name: string;
};

type Props = {
  name: string;
  label: string;
  control: any;
  route: string;
  disabled?: boolean;
  rules?: any;
  multiple?: boolean;
};

const SelectField = ({
  name,
  label,
  control,
  route,
  disabled = false,
  rules,
  multiple = false,
}: Props) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Watch selected values
   */
  const selectedValue = useWatch({
    control,
    name,
  });

  /**
   * Fetch dropdown data
   */
  const fetchOptions = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}${route}`);

      if (!response.ok) {
        throw new Error("Failed to fetch dropdown data");
      }

      const result = await response.json();

      setOptions(result.data);
    } catch (error) {
      console.error("Dropdown fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [route]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={multiple ? [] : ""}
      render={({ field, fieldState }) => (
        <FormControl
          fullWidth
          error={!!fieldState.error}
          disabled={disabled || loading}
        >
          <InputLabel>{label}</InputLabel>

          <Select
            {...field}
            multiple={multiple}
            label={label}
            value={field.value ?? (multiple ? [] : "")}
            renderValue={(selected: any) => {
              if (!multiple) {
                const selectedItem = options.find(
                  (item) => item.id === selected,
                );
                return selectedItem?.name ?? "";
              }

              return selected
                .map(
                  (id: number) => options.find((item) => item.id === id)?.name,
                )
                .join(", ");
            }}
          >
            {loading ? (
              <MenuItem value="">
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              options.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {multiple && (
                    <Checkbox
                      checked={field.value?.includes?.(item.id) || false}
                    />
                  )}

                  <ListItemText primary={item.name} />
                </MenuItem>
              ))
            )}
          </Select>

          <FormHelperText>{fieldState.error?.message}</FormHelperText>

          {/* Debug watcher output */}
          {selectedValue && (
            <FormHelperText>
              Selected: {JSON.stringify(selectedValue)}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectField;
