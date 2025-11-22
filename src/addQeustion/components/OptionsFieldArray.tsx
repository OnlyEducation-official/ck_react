import React from "react";
import {
  useFieldArray,
  Control,
  UseFormWatch,
  UseFormSetValue,
  FieldValues,
} from "react-hook-form";
import { Box, Grid, Button, Checkbox, FormControlLabel, Stack, IconButton, Typography } from "@mui/material";
import MainEditor from "./MainEditor";
import DeleteIcon from '@mui/icons-material/Delete';
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField";
import { optionLabel } from "../_components/data"

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
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
        <Typography variant="subtitle1">Options</Typography>
        <Button variant="outlined" size="small" onClick={handleAddOption}>
          + Add Option
        </Button>
      </Box>

      <Grid container spacing={3}>
        {fields.map((field, index) => (
          <Grid
            size={{ xs: 12, md: 6 }}
            key={field.id}
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              // p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ borderBottom: '1px solid', borderColor: 'rgb(204, 204, 204)', paddingInline: 2, paddingBlock: 1 }}>
              {/* <Box fontWeight={600}>Option {index + 1}</Box> */}
              <Typography variant="subtitle1">Options {index + 1}</Typography>
              <IconButton size="small" onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>

            <Stack gap={1} sx={{ paddingInline: 2, paddingBlock: 1 }}>

              <SimpleSelectField
                label="Option Label"
                name={`options.${index}.option_label` as any}  
                control={control}
                options={optionLabel}                          
                noneOption={false}
                rules={{ required: "Please select a label" }}
              />

              <MainEditor
                name={`options.${index}.option`}
                setValue={setValue as any}
                watch={watch as any}
                value={watch(`options.${index}.option` as any)} // ✅ correct
              />

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



            </Stack>
            {/* <Button
              variant="outlined"
              color="error"
              onClick={() => remove(index)}
            >
              Remove Option
            </Button> */}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OptionsFieldArray;
