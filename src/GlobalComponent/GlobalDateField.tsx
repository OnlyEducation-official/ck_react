import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parse, isValid } from "date-fns";

const DATE_FORMAT = "yyyy/MM/dd";

type GlobalDateFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  disableFuture?: boolean;
};

export function GlobalDateField<TFieldValues extends FieldValues>({
  name,
  control,
  label = "Date of Birth",
  disableFuture = true,
}: GlobalDateFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const parsedValue =
          typeof field.value === "string"
            ? parse(field.value, DATE_FORMAT, new Date())
            : null;

        return (
          <DatePicker
            label={label}
            disableFuture={disableFuture}
            format={DATE_FORMAT}
            views={["year", "month", "day"]}
            openTo="year"
            value={isValid(parsedValue) ? parsedValue : null}
            onChange={(date) => {
              field.onChange(date ? format(date, DATE_FORMAT) : null);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
              },
            }}
          />
        );
      }}
    />
  );
}
