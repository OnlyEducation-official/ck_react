import React, { useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import SimpleTextField from "../GlobalComponent/SimpleTextField";
import OptimizedTopicSearch from "../addQeustion/_components/OptimizedTopicSearch";
import { slugify, useSlugGenerator } from "../hooks/useSlugGenerator";
import { useNavigate, useParams } from "react-router-dom";
import { toastResponse } from "../util/toastResponse";
import { toast } from "react-toastify";
import { getAuditFields } from "@/util/audit";
import { AuthContext } from "@/context/AuthContext";
import AuditModalButton from "@/util/AuditInfoCard";
import { GetJwt, GetRoleType } from "@/util/utils";
// ------------------------
// ZOD SCHEMA
// ------------------------
const TestSchema = z.object({
  createdby: z.string(),
  updatedby: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  is_active: z.boolean(),
  test_series_subject: z
    .array(
      z
        .object({ id: z.number().optional(), name: z.string().optional() })
        .optional()
    )
    .optional(),
  test_series_subject_category: z
    .array(
      z
        .object({ id: z.number().optional(), name: z.string().optional() })
        .optional()
    )
    .optional(),
});

type TestSchemaType = z.infer<typeof TestSchema>;

// ------------------------
// FORM COMPONENT
// ------------------------
const SubjectChapterForm: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { qid } = useParams();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestSchemaType>({
    resolver: zodResolver(TestSchema),
    defaultValues: {
      name: "",
      slug: "",
      is_active: true,
      // test_series_question: {
      //   id: 0,
      //   name: "",
      // },
      test_series_subject_category: [],
      test_series_subject: [],
      createdby: "",
      updatedby: "",
      createdAt: "",
      updatedAt: ""
    },
  });
  const nameValue = watch("name");
  useEffect(() => {
    if (!nameValue) return;
    setValue("slug", slugify(nameValue));
  }, [nameValue, setValue]);

  const jwt_token = GetJwt()


  useEffect(() => {
    if (!qid) return; // create mode

    const fetchData = async () => {
      const url = `${import.meta.env.VITE_BASE_URL
        }test-series-chapters/${qid}?populate=*`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });

      const json = await res.json();
      const item = json?.data?.attributes;

      console.log(item)
      console.log('item.test_series_subject_category?.data?.attributes?.name: ', item.test_series_subject_category?.data);

      reset({
        name: item?.name ?? "",
        slug: item?.slug ?? null,
        is_active: item?.is_active ?? true,
        test_series_subject_category: item.test_series_subject_category?.data?.attributes?.name ? [
          {
            name: item.test_series_subject_category?.data?.attributes?.name,
            id: item.test_series_subject_category?.data?.id,
          },
        ] : [],
        test_series_subject: item.test_series_subject?.data?.attributes?.name ? [
          {
            name: item.test_series_subject?.data?.attributes?.name,
            id: item.test_series_subject?.data?.id,
          },
        ] : [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        createdby: item.createdby,
        updatedby: item.updatedby,
        // is_active: item?.isActive ?? true,
      });
    };

    fetchData();
  }, [qid, reset]);

  console.log(watch())

  useSlugGenerator({
    setValue: setValue,
    watch: watch,
    source: "name",
    target: "slug",
  });

  const onSubmit = async (data: TestSchemaType) => {
    try {

      const isEdit = Boolean(qid);

      const audit = getAuditFields(isEdit, user);

      data = {
        ...data,
        ...audit
      }

      const url = isEdit
        ? `${import.meta.env.VITE_BASE_URL}test-series-chapters/${qid}`
        : `${import.meta.env.VITE_BASE_URL}test-series-chapters`;
      // test-series-subjects

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt_token}`,
        },
        body: JSON.stringify({
          data: data,
        }),
      });

      const success = await toastResponse(
        res,
        `${qid ? "Updated" : "Created"} subject successfully`,
        " subject is Failed"
      );
      const json = await res.json();
      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      if (!qid) {
        reset();
        navigate("/test-chapter-list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        marginBlockStart: 7,
        paddingInline: { xs: 2, sm: 3, md: 4 },
        paddingBlock: 4,
      }}
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
            {qid ? "Edit Chapter" : "Add Chapter"}

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

      <Grid
        // component="form"
        // onSubmit={handleSubmit(onSubmit)}
        container
        spacing={3}
      >
        {/* ------------------------------ NAME ------------------------------ */}

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
            control={control}
            name="name"
            label=""
            rules={{ required: "Name is required" }}
          />
        </Grid>

        {/* ------------------------------ SLUG ------------------------------ */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ cursor: "not-allowed !important" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, cursor: "not-allowed !important" }}
          >
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
            control={control}
            name="slug"
            label=""
            disabled
            rules={{ required: "Slug is required" }}
          />
        </Grid>

        {/* ------------------------------ TEST SERIES QUESTION (DROPDOWN) ------------------------------ */}
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Test Series Question
          </Typography>

          <OptimizedTopicSearch
            label=""
            routeName="t-question"
            dropdownType="single"
            fieldName="test_series_question"
            watch={watch}
            setValue={setValue}
            placeholder="Search Question…"
          />
        </Grid> */}

        {/* ------------------------------ SUBJECT CATEGORY (DROPDOWN) ------------------------------ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Select Subject
            {/* <Typography
              variant="subtitle1"
              component="span"
              color="error"
              fontWeight={700}
              marginLeft={0.2}
            >
              *
            </Typography> */}
          </Typography>
          <OptimizedTopicSearch
            label=""
            routeName="test-series-subject"
            dropdownType="single"
            fieldName="test_series_subject"
            watch={watch}
            setValue={setValue}
            placeholder="Search Category…"
          />
        </Grid>

        {/* ------------------------------ SUBJECT CATEGORY (DROPDOWN) ------------------------------ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Subject Category
            {/* <Typography
              variant="subtitle1"
              component="span"
              color="error"
              fontWeight={700}
              marginLeft={0.2}
            >
              *
            </Typography> */}
          </Typography>
          <OptimizedTopicSearch
            label=""
            routeName="test-series-subject-categorie"
            dropdownType="single"
            fieldName="test_series_subject_category"
            watch={watch}
            setValue={setValue}
            placeholder="Search Category…"
          />
        </Grid>

        {/* ------------------------------ ACTIVE SWITCH ------------------------------ */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              // <Switch
              //   checked={field.value}
              //   onChange={(e) => field.onChange(e.target.checked)}
              // />
              <FormControlLabel
                label="Is Active"
                labelPlacement="end"
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontWeight: 600,
                  },
                }}
              />
            )}
          />
          {errors.is_active && (
            <Typography color="error" fontSize={12}>
              {errors.is_active.message}
            </Typography>
          )}
        </Grid>

        {/* ------------------------------ SUBMIT BUTTON ------------------------------ */}
        <Grid size={12}>
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
            {qid ? "Update" : "Create"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubjectChapterForm;
