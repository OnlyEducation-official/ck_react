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
import { toast } from "react-toastify";

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
      console.log("item: ", item);

      console.log(
        "slug: item.test_series_subject?.data.slug: ",
        item.test_series_subject?.data.attributes.slug
      );
      // Load fetched data into form
      reset({
        name: item?.name ?? "",
        order: item?.order ?? 0,
        slug: item?.slug ?? null,
        is_active: item?.is_active ?? true,
        test_series_subject: [
          {
            name: item.test_series_subject?.data.attributes.name,
            id: item.test_series_subject?.data.id,
          },
        ],
      });
    };

    fetchData();
  }, [qid, reset]);
  const isActive = watch("is_active");

  const onSubmit = async (data: TestSeriesSchemaType) => {
    try {
      const url = qid
        ? `${import.meta.env.VITE_BASE_URL}t-topics/${qid}` // UPDATE
        : `${import.meta.env.VITE_BASE_URL}t-topics`; // CREATE
      const response = await fetch(url, {
        method: qid ? "PUT" : "POST",
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
      const success = await toastResponse(
        response,
        qid ? "Updated Topic Successfully!" : "Created Topic Successfully!",
        qid ? "Update Topic Failed!" : "Create Topic Failed!"
      );
      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      // reset();
      // router.push("/exam-category");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };
  console.log("watch", watch());

  return (
    <Box sx={{ marginBlockStart: 7, bgcolor: "background.paper", paddingInline: { xs: 2, sm: 3, md: 4 }, paddingBlock: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 2, md: 4 },
          fontWeight: "bold",
          pl: 2,
          borderLeft: "6px solid",
          borderColor: "primary.main",
        }}
      >
        {qid ? "Edit Topic" : "Add Topic"}
      </Typography>

      <Grid container spacing={3}>
        {/* NAME */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Name
            <Typography
              variant="subtitle1"
              component="span"
              color="error"
              fontWeight={700}
              marginLeft={0.2}
            >
              *
            </Typography>
          </Typography>
          <SimpleTextField
            name="name"
            control={control}
            // label="Test Topic Subject"
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Slug
            <Typography
              variant="subtitle1"
              component="span"
              color="error"
              fontWeight={700}
              marginLeft={0.2}
            >
              *
            </Typography>
          </Typography>
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
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Subject
            <Typography
              variant="subtitle1"
              component="span"
              color="error"
              fontWeight={700}
              marginLeft={0.2}
            >
              *
            </Typography>
          </Typography>
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
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Order
          </Typography>
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
            // label="Is Active"
            label={
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Is Active
                <Typography
                  variant="subtitle1"
                  component="span"
                  color="error"
                  fontWeight={700}
                  marginLeft={0.2}
                >
                  *
                </Typography>
              </Typography>
            }
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              px: 5,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "18px",
              borderRadius: "13px",
              background: "linear-gradient(90deg, #4C6EF5, #15AABF)",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
              "&:hover": {
                background: "linear-gradient(90deg, #3B5BDB, #1098AD)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
              },
            }}
          >
            {qid ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestSeriesForm;
