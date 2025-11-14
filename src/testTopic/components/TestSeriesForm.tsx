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
import {
  TestSeriesSchema,
  TestSeriesSchemaType,
} from "../../validation/testSeriesSchema";
import SimpleSelectField, {
  Option,
} from "../../GlobalComponent/SimpleSelectField";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import GlobalSelectField from "../../GlobalComponent/GlobalSelectField";

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
      order: 0,
      is_active: true,
      test_series_subject: 0,
    },
  });
  console.log("watch: ", watch());

  const getData = useInitialDataContext();
  console.log("getTopicData: ", getData?.topicTagData);

  const isActive = watch("is_active");

  const onSubmit = async (data: TestSeriesSchemaType) => {
    console.log("FORM SUBMIT:", data);

    const response = await fetch(
      "https://admin.onlyeducation.co.in/api/t-topics",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 66d120408f58d56aa5aa2e264116bf90b16aec576dc6ef1f7dcabd06c4e5a149dd907ea9cf256dc2368e8b4ede420f708d7a90e4e98c58bad428ba24a91b83a077ea75dcd16df26dae318305eaa50d5b8a4ca55673e8493df1f70c244f6bfac8d964599a3f6d0874f4ed2fc186ae1689ec05b6488de5810d0133c5c461d99381",
        },
        body: JSON.stringify({ data: data }),
      }
    );
    const datas = await response.json();
    console.log("response", datas);
  };

  return (
    <Box
      p={4}
      sx={{ marginBlockStart: 5 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h5" mb={3}>
        Test Series Form
      </Typography>

      <Grid container spacing={3}>
        {/* NAME */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SimpleTextField
            name="name"
            control={control}
            label="Test Topic Subject"
            // options={getData?.topicTagData.map((topic) => ({
            //   value: topic.id,
            //   label: topic?.attributes?.name,
            // }))}
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
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
          {/* <SimpleTextField
            name="order"
            control={control}
            label="Order"
            type="number"
          /> */}
          {/* <GlobalSelectField
            name="test_series_subject"
            control={control}
            label="Test Series Subject"
            options={getData?.subjectTagData?.map((topic) => ({
              value: topic.id,
              label: topic?.attributes?.name,
            }))}
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          /> */}
          <GlobalSelectField
            name="order"
            control={control}
            label="Order"
            options={[
              { value: 0, label: "0" },
              { label: "1", value: 1 },
            ]}
            isOptionEqualToValue={
              watch("order") === 0
                ? (a, b) => a.value === b.value
                : (a, b) => a.value === b.value
            }
            // placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
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
