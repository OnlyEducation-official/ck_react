import React, { useEffect } from "react";
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
import {
  TestSeriesSchema,
  TestSeriesSchemaType,
} from "../../validation/testSeriesSchema";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import { useParams } from "react-router-dom";

const TestSeriesForm = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestSeriesSchemaType>({
    resolver: zodResolver(TestSeriesSchema),
    defaultValues: {
      name: "",
      //   slug: "",
      order: 0,
      is_active: true,
      test_series_subject: 0,
    },
  });
  const { id } = useParams(); // id will be string | undefined

  const getData = useInitialDataContext();


  useEffect(() => {
    if (!id) return; // no id → create mode → don't fetch data

    const fetchData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}t-topics/${id}?[fields][0]=name&[fields][1]=slug&[fields][2]=is_active&[fields][3]=order&populate[test_series_subject][fields][0]=id`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
          },
        }
      );

      const json = await res.json();
      const item = json?.data?.attributes;

      // Load fetched data into form
      reset({
        name: item?.name ?? "",
        order: item?.order ?? 0,
        is_active: item?.is_active ?? true,
        test_series_subject: item.test_series_subject?.data?.id ?? 0,
      });
    };

    fetchData();
  }, [id, reset]);
  const isActive = watch("is_active");

  const onSubmit = async (data: TestSeriesSchemaType) => {
    const url = id
      ? `https://admin.onlyeducation.co.in/api/t-topics/${id}` // UPDATE
      : `https://admin.onlyeducation.co.in/api/t-topics`; // CREATE

    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();
  };

  return (
    <Box
      p={4}
      sx={{ marginBlockStart: 5 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h5" mb={3}>
        {id ? "Update Test Topic" : "Create Test Topic"}
      </Typography>

      <Grid container spacing={3}>
        {/* NAME */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Test Topic Subject</Typography>
          <SimpleTextField
            name="name"
            control={control}
            // label="Test Topic Subject"
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          />
        </Grid>

        {/* SUBJECT RELATION (multi select) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Test Series Subject</Typography>
          <SimpleSelectField
            name="test_series_subject"
            control={control}
            label=""
            options={getData?.subjectTagData?.map((topic) => ({
              value: topic.id,
              label: topic?.attributes?.name,
            }))}
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          />
        </Grid>

        {/* ORDER */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Order</Typography>
          <SimpleSelectField
            name="order"
            control={control}
            label=""
            options={[
              { value: 0, label: "0" },
              { label: "1", value: 1 },
            ]}
            noneOption={false}
            rules={{ required: "Select at least one subject" }}
          />
        </Grid>

        {/* IS ACTIVE */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          {/* <Typography variant="subtitle1">Test Topic Subject</Typography> */}
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
