import {
  Controller,
  type Control,
  type FieldValues,
  type RegisterOptions,
  type Path,
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
  noneOption?: boolean;
  myCallBackFn?: () => void;
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
  noneOption = false,
  myCallBackFn,
}: SimpleSelectFieldProps<T>) => {
  let ok = options.filter((o) => {
    return o.value;
  });

  // console.log(ok)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          fullWidth={fullWidth}
          error={!!fieldState.error}
          disabled={disabled}
          sx={{
            "& .MuiInputLabel-root": {
              fontSize: "0.9rem",
              fontWeight: 600,
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "#fafafa",
              transition: "0.25s ease",
              "& fieldset": {
                borderColor: "#D0D5DD",
              },

              // Hover effect
              "&:hover fieldset": {
                borderColor: "#b5b5b5",
              },

              // Focus effect
              "&.Mui-focused fieldset": {
                borderColor: "var(--mui-palette-primary-main)",
                boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.25)", // blue glow
              },

              // Error style
              "&.Mui-error fieldset": {
                borderColor: "#d32f2f",
              },
            },
            "& .MuiSelect-select": {
              padding: "10px 12px",
              // fontSize: "0.9rem",
              fontWeight: 500,
              color: "rgba(0,0,0,0.7) !important", // always soft grey
            },
            // Dropdown arrow style
            "& .MuiSelect-icon": {
              color: "#555",
            },

            "& .MuiSelect-select.Mui-focused": {
              color: "#3f7cd1 !important",
            },

            // When dropdown is open (aria-expanded = true)
            "& .MuiSelect-select[aria-expanded='true']": {
              color: "#3f7cd1 !important",
            },

            // Prevent MUI overriding color during highlight
            "& .MuiMenuItem-root.Mui-selected": {
              color: "#3f7cd1 !important",
              backgroundColor: "rgba(234, 0, 0, 0.8) !important",
            },
            "& .MuiMenuItem-root.Mui-selected:hover": {
              backgroundColor: "rgba(234, 0, 0, 0.8) !important",
            },

            "& .MuiMenuItem-root": {
              color: "#3f7cd1 !important", // menu option color
              fontSize: "0.9rem",
            },
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderColor: "#4A90E2 !important",
            },
          }}
        >
          <InputLabel size="small">{label}</InputLabel>
          <Select
            {...field}
            label={label}
            size="small"
            value={
              typeof field.value === "number"
                ? field.value
                  ? field.value
                  : noneOption
                    ? ""
                    : 0
                : field.value
            }
            slotProps={{
              root: {
                style: {
                  // maxHeight: '430px',
                  width: "100%",
                },
              },
            }}
            MenuProps={{
              style: {
                maxHeight: "430px",
                width: "100%",
              },
            }}
            onChange={(e) => {
              if (typeof e.target.value === "number") {
                field.onChange(Number(e.target.value));
              } else {
                field.onChange(e.target.value);
              }

              if (myCallBackFn) {
                myCallBackFn();
              }
            }}
          >
            {noneOption && <MenuItem value={0}></MenuItem>}

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
