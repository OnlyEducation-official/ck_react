import { Box, Button, Grid, Typography } from "@mui/material";
import SimpleSelectField, {
  Option,
} from "../../GlobalComponent/SimpleSelectField";
import { useForm } from "react-hook-form";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import { difficultyOptions } from "../../addQeustion/_components/data";
import {
  examsSchema,
  ExamsSchemaType,
} from "../../validation/testSeriesExamSchema";
import { useEffect, useState } from "react";
import { slugify } from "../../testSubject/components/TestSubjectForm";
import OptimizedTopicSearch from "../../addQeustion/_components/OptimizedTopicSearch";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export default function TestExamFormStructure() {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      slug: null,
      description: "",
      test_series_category: 0,
      // test_series_questions: 0,
      marking_negative: 0,
      marking_positive: 0,
      timer: 0,
      test_series_subjects: [],
      difficulty: "Easy",
      test_series_topics: [],
    },
    resolver: zodResolver(examsSchema),
  });

  const onSubmitt = (data: ExamsSchemaType) => {

    const url = id
      ? `${import.meta.env.VITE_BASE_URL}t-exams/${id}` // UPDATE
      : `${import.meta.env.VITE_BASE_URL}t-exams`; // CREATE

    const method = id ? "PUT" : "POST";

    const response = fetch(`${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
      },
      body: JSON.stringify({ data: data }),
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }t-exams/${id}?populate[test_series_category][fields][0]=name&populate[test_series_subjects][fields][0]=name&populate[test_series_topics][fields][0]=name`,
          {
            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
            },
          }
        );
        const { data } = await response.json();

        reset({
          title: data?.attributes?.title,
          slug: data?.attributes?.slug,
          description: data?.attributes?.description,
          test_series_category:
            data?.attributes?.test_series_category?.data?.id,
          marking_negative: data?.attributes?.marking_negative,
          marking_positive: data?.attributes?.marking_positive,
          timer: data?.attributes?.timer,
          test_series_subjects:
            data?.attributes?.test_series_subjects?.data?.map(
              (subject: any) => ({
                id: subject?.id,
                name: subject?.attributes?.name,
              })
            ),
          difficulty: data?.attributes?.difficulty,
          test_series_topics: data?.attributes?.test_series_topics?.data?.map(
            (topic: any) => ({
              id: topic?.id,
              name: topic?.attributes?.name,
            })
          ),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    data: { examCategoryData },
  } = useInitialDataContext();
  useEffect(() => {
    if (!watch("title")) return;
    setValue("slug", slugify(watch("title")));
  }, [watch("title"), setValue]);
  
  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmitt)}>
      <Grid
        container
        spacing={3}
        sx={{ marginBlockStart: 10, paddingInline: 3, paddingBlockEnd: 5 }}
      >
        <Grid container size={12}>
          <Typography variant="h4">Exam Form</Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Title
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
            name="title"
            control={control}
            rules={{ required: "Enter title" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
            rules={{ required: "Slug is required" }}
            disabled
            sx={{ pointerEvents: "none", cursor: "not-allowed", opacity: 0.6 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Description
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
            name="description"
            control={control}
            rules={{ required: "Enter description" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Test Series Category
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
          <SimpleSelectField
            name="test_series_category"
            control={control}
            // label="Select Subject"
            options={
              examCategoryData?.map((subject) => ({
                value: subject.id,
                label: subject.attributes.name,
              })) as Option[]
            }
            rules={{ required: "Please select a subject" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Marking Negative
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
            name="marking_negative"
            control={control}
            type="number"
            // label="Test Series Topic"
            // options={difficultyOptions}
            rules={{ required: "Please select a Topic" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Marking Positive
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
            name="marking_positive"
            control={control}
            type="number"
            // label="Test Series Topic"
            // options={difficultyOptions}
            rules={{ required: "Please select a Topic" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {`Timer (seconds)`}
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
            name="timer"
            control={control}
            // label="Select Subject"
            rules={{ required: "Please select a subject" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OptimizedTopicSearch
            routeName="test-series-subject"
            dropdownType="multi"
            fieldName="test_series_subjects"
            setValue={setValue}
            watch={watch}
            placeholder="topic and search"
            label="Select Subject"
            required={true}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Difficulty
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
          <SimpleSelectField
            name="difficulty"
            control={control}
            // label="Test Series Topic"
            options={difficultyOptions}
            rules={{ required: "Please select a Topic" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <OptimizedTopicSearch
            routeName="t-topic"
            dropdownType="multi"
            fieldName="test_series_topics"
            setValue={setValue}
            watch={watch}
            placeholder="search Topic eg: Algebra"
            label="Select Topic"
            required={true}
          />
        </Grid>
        {/* <pre>{JSON.stringify(watch("test_series_topics"), null, 2)}</pre> */}
        <Grid size={12} sx={{ textAlign: "center", paddingBlock: 2 }}>
          <Button variant="contained" type="submit" sx={{ paddingInline: 10 }}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
