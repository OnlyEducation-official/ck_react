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
import { useSlugGenerator } from "../../hooks/useSlugGenerator";
import { toastResponse } from "../../util/toastResponse";
import SimpleMultiAutoComplete from "../../GlobalComponent/SimpleMultiAutoComplete";
import OptimizedTopicSearch from "../../addQeustion/_components/OptimizedTopicSearch";

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
      slug: "",
      order: 0,
      is_active: true,
      test_series_subject: [],
    },
  });
  const { qid } = useParams(); // qid will be string | undefined

  useSlugGenerator<TestSeriesSchemaType>({
    watch,
    setValue,
    source: "name",
    target: "slug",
  });
  const {
    data: { subjectTagData },
  } = useInitialDataContext();

  useEffect(() => {
    if (!qid) return; // no qid → create mode → don't fetch data

    const fetchData = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL
        }t-topics/${qid}?[fields][0]=name&[fields][1]=slug&[fields][2]=is_active&[fields][3]=order&populate[test_series_subject][fields]=qid`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
          },
        }
      );

      const json = await res.json();
      const item = json?.data?.attributes;
      console.log('item: ', item);

      console.log('slug: item.test_series_subject?.data.slug: ', item.test_series_subject?.data.attributes.slug);
      // Load fetched data into form
      reset({
        name: item?.name ?? "",
        order: item?.order ?? 0,
        slug: item?.slug ?? null,
        is_active: item?.is_active ?? true,
        test_series_subject: [{ name: item.test_series_subject?.data.attributes.name, id: item.test_series_subject?.data.id }],
      });

    };

    fetchData();
  }, [qid, reset]);
  const isActive = watch("is_active");

  const onSubmit = async (data: TestSeriesSchemaType) => {
    const url = qid
      ? `${import.meta.env.VITE_BASE_URL}t-topics/${qid}` // UPDATE
      : `${import.meta.env.VITE_BASE_URL}t-topics`; // CREATE

    const method = qid ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
      },
      body: JSON.stringify({ data }),
    });
    toastResponse(
      response,
      `${qid ? "Updated" : "Created"} Topic successfully`,
      " Topic is Failed"
    );

    const result = await response.json();
  };
  console.log('watch', watch())

  return (
    <Box
      p={4}
      sx={{ marginBlockStart: 5 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h5" mb={3}>
        {qid ? "Update Topic" : "Add Topic"}
      </Typography>

      <Grid container spacing={3}>
        {/* NAME */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Name</Typography>
          <SimpleTextField
            name="name"
            control={control}
            // label="Test Topic Subject"
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Slug</Typography>
          <SimpleTextField
            name="slug"
            control={control}
            disabled={true}
            sx={{
              cursor: "not-allowed",
              "& .MuiInputBase-root": {
                cursor: "not-allowed",
              },
              "& .MuiInputBase-input": {
                cursor: "not-allowed",
              },
            }}
            rules={{ required: "Slug is required" }}
          />
        </Grid>

        {/* SUBJECT RELATION (multi select) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Subject</Typography>
          <OptimizedTopicSearch
            routeName="test-series-subject"
            dropdownType="single"
            fieldName="test_series_subject"
            setValue={setValue}
            watch={watch}
          />
          {/* <SimpleSelectField
            name="test_series_subject"
            control={control}
            label=""
            options={subjectTagData?.map((topic) => ({
              value: topic.id,
              label: topic?.attributes?.name,
            }))}
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          /> */}
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
