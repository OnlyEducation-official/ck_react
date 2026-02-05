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
import OptimizedTopicSearch from "../addQeustion/_components/OptimizedTopicSearch";
import SimpleTextField from "../GlobalComponent/SimpleTextField";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { slugify, useSlugGenerator } from "../hooks/useSlugGenerator";
import { toastResponse } from "../util/toastResponse";
import { toast } from "react-toastify";
import { getAuditFields } from "@/util/audit";
import { AuthContext } from "@/context/AuthContext";
import AuditModalButton from "@/util/AuditInfoCard";


// ----------------------------
// ZOD SCHEMA
// ----------------------------
const TestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  is_active: z.boolean(),

  test_series_subject: z
    .array(
      z
        .object({
          id: z.number().optional(),
          name: z.string().optional(),
        })
        .optional()
    )
    .optional(),

  test_series_chapters: z
    .array(
      z
        .object({
          id: z.number(),
          name: z.string().optional(),
        })
        .optional()
    )
    .optional(),
  createdby: z.string(),
  updatedby: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  // test_series_questions: z
  //   .array(
  //     z.object({
  //       id: z.number(),
  //       name: z.string().optional(),
  //     })
  //   )
  //   .optional(),
});

type TestSchemaType = z.infer<typeof TestSchema>;

export default function SubjectCategories() {
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
      test_series_subject: [],
      test_series_chapters: [],
      createdby: "",
      updatedby: "",
      createdAt: "",
      updatedAt: ""
      // test_series_questions: [],
    },
  });

  const nameValue = watch("name");
  useEffect(() => {
    if (!nameValue) return;
    setValue("slug", slugify(nameValue));
  }, [nameValue, setValue]);

  useEffect(() => {
    if (!qid) return; // create mode

    const fetchData = async () => {
      const url = `${import.meta.env.VITE_BASE_URL
        }test-series-subject-categories/${qid}?populate=*`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
      });

      const json = await res.json();
      const item = json?.data?.attributes;

      reset({
        name: item?.name ?? "",
        slug: item?.slug ?? null,
        is_active: item?.is_active ?? false,
        test_series_subject: item?.test_series_subject?.data
          ? [
            {
              name: item?.test_series_subject?.data?.attributes?.name,
              id: item?.test_series_subject?.data.id,
            },
          ]
          : [],
        test_series_chapters: item?.test_series_chapters?.data.map(
          (chapter: any) => ({
            name: chapter?.attributes?.name,
            id: chapter?.id,
          })
        ),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        createdby: item.createdby,
        updatedby: item.updatedby,
        // {
        //   name: item?.test_series_chapters?.data.map(
        //     (item: any) => item?.attributes?.name
        //   ),
        //   id: item?.test_series_chapters?.data.map((item: any) => item?.id),
        // },
        // ,
        // is_active: item?.isActive ?? true,
      });
    };

    fetchData();
  }, [qid, reset]);

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
        ? `${import.meta.env.VITE_BASE_URL
        }test-series-subject-categories/${qid}`
        : `${import.meta.env.VITE_BASE_URL}test-series-subject-categories`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
        body: JSON.stringify({
          data: data,
        }),
      });

      const success = await toastResponse(
        res,
        `${qid ? "Updated" : "Created"} Subject Categories successfully`,
        "Subject categories is Failed"
      );
      const json = await res.json();
      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      if (!qid) {
        reset();
        navigate("/test-subject-category-list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // ----------------------------
  // UI + FORM
  // ----------------------------
  return (
    <Card sx={{ borderRadius: 3, p: 2, marginBlockStart: 7 }} elevation={0}>
      <CardContent>


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
              {qid ? "Edit Subject Category" : "Add Subject Category"}

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



        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* ---------------- NAME ---------------- */}
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
                label=""
                rules={{ required: "Name is required" }}
              />
            </Grid>

            {/* ---------------- SLUG ---------------- */}
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
                disabled
                label=""
                rules={{ required: "Slug is required" }}
                sx={{
                  pointerEvents: "none", // disable interaction on the field itself
                  cursor: "not-allowed",
                  "& *": {
                    cursor: "not-allowed !important", // force it on all children
                  },
                }}
              />
            </Grid>

            {/* ---------------- SUBJECT (single) ---------------- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Subject
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
                placeholder="Search subject..."
              />
            </Grid>

            {/* ---------------- CHAPTERS (multi) ---------------- */}
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Chapters
              </Typography>
              <OptimizedTopicSearch
                label=""
                routeName="test-series-chapter"
                dropdownType="multi"
                fieldName="test_series_chapters"
                watch={watch}
                setValue={setValue}
                placeholder="Search chapters..."
              />
            </Grid> */}

            {/* ---------------- QUESTIONS (multi) ---------------- */}
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <OptimizedTopicSearch
                label="Questions"
                routeName="t-question"
                dropdownType="multi"
                fieldName="test_series_questions"
                watch={watch}
                setValue={setValue}
                placeholder="Search questions..."
              />
            </Grid> */}

            {/* ---------------- IS ACTIVE SWITCH ---------------- */}
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

            {/* ---------------- SUBMIT ---------------- */}
            <Grid size={12}>
              <Button
                type="submit"
                size="large"
                variant="contained"
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
                {qid ? "Update" : "Create"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

