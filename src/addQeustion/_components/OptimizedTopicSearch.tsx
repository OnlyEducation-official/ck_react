import {
  Autocomplete,
  TextField,
  CircularProgress,
  Chip,
  Typography,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";

type Option = {
  id: number;
  name?: string;
};

type Props<T> = {
  name: keyof T;
  label: string;
  route: string;
  watch: any;
  setValue: any;
  errors?: any;
  dropdownType?: "single" | "multi";
  required?: boolean;
};

const SelectField = <T extends Record<string, any>>({
  name,
  label,
  route,
  watch,
  setValue,
  errors,
  dropdownType = "multi",
  required = false,
}: Props<T>) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const selectedIds = watch(name);

  /**
   * debounce helper
   */
  const debounce = (fn: Function, delay = 400) => {
    let timer: any;

    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /**
   * fetch options
   */
  const fetchOptions = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}${route}`);

      if (!res.ok) {
        throw new Error("Dropdown fetch failed");
      }

      const data = await res.json();

      setOptions(data.data);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchOptions, 400), []);

  useEffect(() => {
    if (open) debouncedFetch();
  }, [open]);

  /**
   * selected objects from stored ids
   */
  const selectedObjects =
    dropdownType === "single"
      ? options.find((opt) => opt.id === selectedIds) || null
      : options.filter((opt) => selectedIds?.includes?.(opt.id));

  /**
   * change handler
   */
  const handleChange = (_: any, value: Option | Option[] | null) => {
    if (dropdownType === "multi") {
      const arr = (value as Option[]) ?? [];

      setValue(
        name,
        arr.map((v) => v.id),
        { shouldValidate: true },
      );
    } else {
      const obj = value as Option | null;

      setValue(name, obj?.id ?? null, {
        shouldValidate: true,
      });
    }
  };

  return (
    <>
      <Typography sx={{ mb: 1 }}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </Typography>

      <Autocomplete<Option, boolean, false, false>
        multiple={dropdownType === "multi"}
        options={options}
        loading={loading}
        value={selectedObjects}
        onChange={handleChange}
        isOptionEqualToValue={(o, v) => o.id === v.id}
        getOptionLabel={(o) => o.name || `#${o.id}`}
        renderInput={(params) => {
          const { InputLabelProps, InputProps, inputProps, ...rest } = params;

          return (
            <TextField
              {...rest}
              size="small"
              error={!!errors}
              helperText={errors || ""}
              InputProps={{
                ...InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress size={18} />}
                    {InputProps.endAdornment}
                  </>
                ),
              }}
              inputProps={{
                ...inputProps,
              }}
              InputLabelProps={{
                ...InputLabelProps,
                className: InputLabelProps?.className ?? "",
                style: InputLabelProps?.style ?? {},
              }}
            />
          );
        }}
      />
    </>
  );
};

export default SelectField;
