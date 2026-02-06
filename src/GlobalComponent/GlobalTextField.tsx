import { Controller, Control } from "react-hook-form";
import { TextField } from "@mui/material";

type Props = {
  name: string;
  control: Control<any>;
  label: string;
  type?: string;
  rows?: number;
};

export default function GlobalTextField({
  name,
  control,
  label,
  type = "text",
  rows,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          size="small"
          label={label}
          type={type}
          multiline={Boolean(rows)}
          {...(rows ? { rows } : {})}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
