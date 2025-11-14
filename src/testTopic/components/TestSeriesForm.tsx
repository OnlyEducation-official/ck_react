import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
  Box,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { TestSeriesSchema, TestSeriesSchemaType } from "../../validation/testSeriesSchema";
import SimpleSelectField, { Option } from "../../GlobalComponent/SimpleSelectField";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";


const subjects: Option[] = [
  { value: 1, label: "Chemistry" },
  { value: 2, label: "Physics" },
];



const TestSeriesForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestSeriesSchemaType>({
    resolver: zodResolver(TestSeriesSchema),
    defaultValues: {
      name: "",
    //   slug: "",
      order: undefined,
      is_active: true,
      test_series_subject: 0,
    },
  });

  const isActive = watch("is_active");

  const onSubmit = (data: TestSeriesSchemaType) => {
    console.log("FORM SUBMIT:", data);
  };

  return (
    <Box p={4} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" mb={3}>
        Test Series Form
      </Typography>

      <Grid container spacing={3}>
        {/* NAME */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SimpleTextField
            name="name"
            control={control}
            label="Name"
            rules={{ required: "Name is required" }}
          />
        </Grid>

        {/* SLUG
        <Grid size={{ xs: 12, md: 6 }}>
          <SimpleTextField
            name="slug"
            
            control={control}
            label="Slug"
            rules={{ required: "Slug is required" }}
          />
        </Grid> */}

        {/* SUBJECT RELATION (multi select) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SimpleSelectField
            name="test_series_subject"
            control={control}
            label="Test Series Subject"
            options={subjects}
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          />
        </Grid>

        {/* ORDER */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SimpleTextField
            name="order"
            control={control}
            label="Order"
            type="number"
          />
        </Grid>

        {/* IS ACTIVE */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setValue("is_active", e.target.checked)}
              />
            }
            label="Is Active"
          />
        </Grid>

        {/* QUESTIONS RELATION (multi select) */}
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <SimpleSelectField
            name="test_series_questions"
            control={control}
            label="Test Series Questions"
            options={questions}
            placeholder="Add relation"
            rules={{ required: "Select at least one question" }}
          />
        </Grid> */}

        <Grid size={{ xs: 12 }}>
          <Button variant="contained" type="submit" fullWidth>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestSeriesForm;
