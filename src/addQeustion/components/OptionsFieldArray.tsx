import React from "react";
import {
  useFieldArray,
  Control,
  UseFormWatch,
  UseFormSetValue,
  FieldValues,
} from "react-hook-form";
import { Box, Grid, Button, Checkbox, FormControlLabel } from "@mui/material";
import MainEditor from "./MainEditor";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField";
interface OptionFieldArrayProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
}

const OptionsFieldArray = <T extends FieldValues>({
  control,
  setValue,
  watch,
}: OptionFieldArrayProps<T>) => {
  // Use any for the field array name to avoid deep generic complexity
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options" as any,
  });

  const handleAddOption = () => {
    // cast to any to satisfy RHF typing
    append({ option_label: "", option: "", is_correct: false } as any);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600 }}>Options</h2>
        <Button variant="outlined" onClick={handleAddOption}>
          + Add Option
        </Button>
      </Box>

      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid
            size={{ xs: 12, md: 6 }}
            key={field.id}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box fontWeight={600}>Option {index + 1}</Box>

            {/* <SimpleSelectField
              // name typed as any to allow string path
              name={`options.${index}.option_label` as any}
              control={control}
              label="Option Label"
              options={optionLabelOptions}
              placeholder="Select label"
            /> */}

            <FormControlLabel
              control={
                <Checkbox
                  // watch returns unknown; coerce to boolean
                  checked={!!watch(`options.${index}.is_correct` as any)}
                  onChange={(e) =>
                    // cast value param to any to satisfy setValue typing
                    setValue(
                      `options.${index}.is_correct` as any,
                      e.target.checked as any
                    )
                  }
                />
              }
              label="Mark as correct"
            />

            <MainEditor
              name={`options.${index}.option`}
              setValue={setValue as any}
              watch={watch as any}
              value={watch(`options.${index}.option` as any)} // ✅ correct
            />

            <Button
              variant="outlined"
              color="error"
              onClick={() => remove(index)}
            >
              Remove Option
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OptionsFieldArray;
