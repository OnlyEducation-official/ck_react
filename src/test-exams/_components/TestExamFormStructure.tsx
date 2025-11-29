import { Box, Button, Grid, Typography } from "@mui/material";
import SimpleSelectField, {
  Option,
} from "../../GlobalComponent/SimpleSelectField";
import { Control, useForm } from "react-hook-form";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import { QuestionSchemaType } from "../../addQeustion/QuestionSchema";
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import {
  difficultyOptions,
  optionTypeData,
} from "../../addQeustion/_components/data";
import MainEditor from "../../addQeustion/components/MainEditor";
import {
  examsSchema,
  ExamsSchemaType,
} from "../../validation/testSeriesExamSchema";
import { useEffect, useState } from "react";
import { slugify } from "../../testSubject/components/TestSubjectForm";
import SimpleMultiAutoComplete from "../../GlobalComponent/SimpleMultiAutoComplete";
import OptimizedTopicSearch from "../../addQeustion/_components/OptimizedTopicSearch";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export default function TestExamFormStructure({}: //   control,
//   watch,
//   setValue,
{
  //   control: Control<ExamsSchemaType>;
  //   watch: UseFormWatch<ExamsSchemaType>;
  //   setValue: UseFormSetValue<ExamsSchemaType>;
}) {
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
  console.log("watch: ", watch());
  console.log("errors: ", errors);

  const onSubmitt = (data: ExamsSchemaType) => {
    console.log("data: ", data);

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

    console.log(response);
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
        console.log("data: ", data);
        console.log(
          "data: ",
          data?.attributes?.test_series_topics?.data?.map((topic: any) => ({
            id: topic?.id,
            name: topic?.attributes?.name,
          }))
        );

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
              (subject: any) => subject?.id
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

  //   if (isLoading) return <div>Loading...</div>;
  // if (!id) return null;
  const {
    data: { examCategoryData, subjectTagData, topicTagData, tExamsData },
    setSubject,
  } = useInitialDataContext();
  useEffect(() => {
    if (!watch("title")) return;
    setValue("slug", slugify(watch("title")));
  }, [watch("title"), setValue]);
  // useEffect(() => {
  //     setSubject(watch('test_series_subjects'));
  // }, [watch('test_series_subjects')]);

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
          <Typography variant="subtitle1">Title</Typography>
          <SimpleTextField
            name="title"
            control={control}
            // label="Test Series Topic"
            // options={difficultyOptions}
            rules={{ required: "Enter title" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Typography variant="subtitle1">Slug</Typography>
          <SimpleTextField
            name="slug"
            control={control}
            rules={{ required: "Slug is required" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1">Description</Typography>
          <SimpleTextField
            name="description"
            control={control}
            // label="Test Series Topic"
            // options={difficultyOptions}
            rules={{ required: "Enter description" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Typography variant="subtitle1">Test Series Category</Typography>
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
          <Typography variant="subtitle1">Marking Negative</Typography>
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
          <Typography variant="subtitle1">Marking Positive</Typography>
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
          <Typography variant="subtitle1">{`Timer (seconds)`}</Typography>
          <SimpleTextField
            name="timer"
            control={control}
            // label="Select Subject"
            rules={{ required: "Please select a subject" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Typography variant="subtitle1">Select subject</Typography>
          {/* <SimpleMultiAutoComplete
            control={control}
            name="test_series_subjects"
            options={
              subjectTagData?.map((subject) => ({
                value: subject.id,
                label: subject.attributes.name,
              })) as Option[]
            }
          /> */}
          <OptimizedTopicSearch
            routeName="test-series-subject"
            dropdownType="single"
            fieldName="test_series_subjects"
            setValue={setValue}
            watch={watch}
          />
          {/* <pre>
            {JSON.stringify(watch("test_series_subjects"), null, 2)}
          </pre> */}

          {/* <SimpleSelectField
                    name="test_series_subjects"
                    control={control}
                    // label="Select Subject"
                    options={
                        subjectTagData?.map((subject) => ({
                            value: subject.id,
                            label: subject.attributes.name,
                        })) as Option[]
                    }
                    rules={{ required: "Please select a subject" }}
                /> */}
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1">Difficulty</Typography>
          <SimpleSelectField
            name="difficulty"
            control={control}
            // label="Test Series Topic"
            options={difficultyOptions}
            rules={{ required: "Please select a Topic" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          {/* <Typography variant="subtitle1">Select topic</Typography> */}
          {/* <SimpleMultiAutoComplete
                    name="test_series_topics"
                    control={control}
                    // label="Test Series Topic"
                    options={
                        topicTagData?.map((topic) => ({
                            value: topic.id,
                            label: topic.attributes.name,
                        })) as Option[]
                    }
                    rules={{ required: "Please select a Topic" }}
                /> */}
          <OptimizedTopicSearch
            routeName="t-topic"
            dropdownType="multi"
            fieldName="test_series_topics"
            setValue={setValue}
            watch={watch}
            // sx={{
            //   border: "2px solid red",
            // }}
            placeholder="topic and search"
            label="sdfs"
            
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
