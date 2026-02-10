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
import { useContext, useEffect, useState } from "react";
import { slugify } from "../../testSubject/components/TestSubjectForm";
import OptimizedTopicSearch from "../../addQeustion/_components/OptimizedTopicSearch";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { toastResponse } from "../../util/toastResponse";
import { getAuditFields } from "@/util/audit";
import { AuthContext } from "@/context/AuthContext";
import AuditModalButton from "@/util/AuditInfoCard";
import { GetJwt, GetRoleType } from "@/util/utils";

export default function TestExamFormStructure() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

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
      createdby: "",
      updatedby: "",
      createdAt: "",
      updatedAt: "",
      title: "",
      slug: null,
      description: "",
      test_series_category: 0,
      marking_negative: 0,
      marking_positive: 0,
      timer: 0,
      test_series_subjects: [],
      difficulty: "Easy",
      test_series_topics: []
    },
    resolver: zodResolver(examsSchema),
  });

  const jwt_token = GetJwt()
  
  const onSubmitt = async (data: ExamsSchemaType) => {
    try {

      const isEdit = Boolean(id);

      // console.log("audit:", isEdit)

      const audit = getAuditFields(isEdit, user);


      data = {
        ...data,
        ...audit
      }

      console.log("submit:", data)

      const res = await fetch(
        isEdit
          ? `${import.meta.env.VITE_BASE_URL}t-exams/${id}`
          : `${import.meta.env.VITE_BASE_URL}t-exams`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt_token}`,
          },
          body: JSON.stringify({
            data: data,
          }),
        }
      );

      const success = await toastResponse(
        await res,
        id
          ? "Updated Exam Form Successfully!"
          : "Created Exam Form Successfully!",
        id ? "Update Exam Form Failed!" : "Create Exam Form Failed!"
      );
      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      if (!id) {
        reset();
        navigate("/exams-list");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (!id) return; // CREATE MODE

    const fetchData = async () => {
      try {

        setIsLoading(true);

        // let url = `${import.meta.env.VITE_BASE_URL}t-exams/${id}?populate[test_series_category][fields][0]=name&populate[test_series_subjects][fields][0]=name&populate[test_series_topics][fields][0]=name`
        let url = `${import.meta.env.VITE_BASE_URL}t-exams/${id}?populate[test_series_category][fields][0]=name&populate[test_series_subjects][fields][0]=name&populate[test_series_topics][fields][0]=name&fields[0]=title&fields[1]=slug&fields[2]=description&fields[3]=timer&fields[4]=marking_negative&fields[5]=marking_positive&fields[6]=createdAt&fields[7]=updatedAt&fields[8]=difficulty&fields[9]=createdby&fields[10]=updatedby`

        console.log(url)

        const response = await fetch(url,
          {
            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${jwt_token}`,
            },
          }
        );

        const { data } = await response.json();

        console.log("data:", data)


        reset({
          createdby: data?.attributes?.createdby,
          updatedby: data?.attributes?.updatedby,
          createdAt: data?.attributes?.createdAt,
          updatedAt: data?.attributes?.updatedAt,
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

  // console.log("watch:", watch(), errors)

  return (
    <Box sx={{ marginBlockStart: 7, bgcolor: "background.paper", paddingInline: { xs: 2, sm: 3, md: 4 }, paddingBlock: 4 }}>
      <Box component={"form"} onSubmit={handleSubmit(onSubmitt)}>
        <Grid
          container
          spacing={2}
        >


          <Grid container size={12} spacing={2} alignItems="center">
            <Grid size={12}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  pl: 2,
                  borderLeft: "6px solid",
                  borderColor: "primary.main",
                }}
              >
                {id ? "Edit Exam " : "Add Exam "}

              </Typography>
            </Grid>

            <Grid sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
              <AuditModalButton
                createdby={watch('createdby')}
                createdat={watch('createdAt')}
                updatedby={watch('updatedby')}
                updatedat={watch('updatedAt')}
              />
            </Grid>
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
            </Typography>
            <SimpleTextField
              name="description"
              control={control}
              label=""
              rules={{ required: "Description is required" }}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Test Series Category
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
              required={false}
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
          {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <OptimizedTopicSearch
              routeName="t-topic"
              dropdownType="multi"
              fieldName="test_series_topics"
              setValue={setValue}
              watch={watch}
              placeholder="search Topic eg: Algebra"
              label="Select Topic"
              required={false}
            />
          </Grid> */}
          {/* <pre>{JSON.stringify(watch("test_series_topics"), null, 2)}</pre> */}
          <Grid size={12} sx={{ textAlign: "start", paddingBlock: 2 }}>
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
              disabled={!GetRoleType()}
            >
              {id ? "Update Exam " : "Create Exam "}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
