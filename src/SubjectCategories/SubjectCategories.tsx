import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import OptimizedTopicSearch from "../addQeustion/_components/OptimizedTopicSearch";
import SimpleTextField from "../GlobalComponent/SimpleTextField";

// import SimpleTextField from "./SimpleTextField";
// import OptimizedTopicSearch from "./OptimizedTopicSearch";

// ----------------------------
// ZOD SCHEMA
// ----------------------------
const TestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  is_active: z.boolean(),

  test_series_subject: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().optional(),
      })
    )
    .optional(),

  test_series_chapters: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().optional(),
      })
    )
    .optional(),

  test_series_questions: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().optional(),
      })
    )
    .optional(),
});

type TestSchemaType = z.infer<typeof TestSchema>;

export default function SubjectCategories() {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestSchemaType>({
    resolver: zodResolver(TestSchema),
    defaultValues: {
      name: "",
      slug: "",
      is_active: false,
      test_series_subject: [],
      test_series_chapters: [],
      test_series_questions: [],
    },
  });

  const onSubmit = (data: TestSchemaType) => {
    console.log("SUBMIT PAYLOAD:", {
      data: {
        ...data,
        test_series_subject: data.test_series_subject?.[0] ?? null,
      },
    });
  };

  // ----------------------------
  // UI + FORM
  // ----------------------------
  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Test Series Form
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* ---------------- NAME ---------------- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <SimpleTextField
                name="name"
                control={control}
                label="Name"
                rules={{ required: "Name is required" }}
              />
            </Grid>

            {/* ---------------- SLUG ---------------- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <SimpleTextField
                name="slug"
                control={control}
                label="Slug"
                rules={{ required: "Slug is required" }}
              />
            </Grid>

            {/* ---------------- SUBJECT (single) ---------------- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <OptimizedTopicSearch
                label="Test Series Subject"
                routeName="test-series-subject"
                dropdownType="single"
                fieldName="test_series_subject"
                watch={watch}
                setValue={setValue}
                placeholder="Search subject..."
              />
            </Grid>

            {/* ---------------- CHAPTERS (multi) ---------------- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <OptimizedTopicSearch
                label="Chapters"
                routeName="test-series-chapter"
                dropdownType="multi"
                fieldName="test_series_chapters"
                watch={watch}
                setValue={setValue}
                placeholder="Search chapters..."
              />
            </Grid>

            {/* ---------------- QUESTIONS (multi) ---------------- */}
            <Grid size={{ xs: 12, md: 6 }}>
              <OptimizedTopicSearch
                label="Questions"
                routeName="t-question"
                dropdownType="multi"
                fieldName="test_series_questions"
                watch={watch}
                setValue={setValue}
                placeholder="Search questions..."
              />
            </Grid>

            {/* ---------------- IS ACTIVE SWITCH ---------------- */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              <Typography fontWeight={600}>Active</Typography>

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
                variant="contained"
                size="large"
                sx={{ borderRadius: 2, py: 1.2, px: 4 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

// {
//     data: {
//         name: string
//         slug: string
//         is_active : false,
//         test_series_subject: {
//             id : number,
//             name : string,
//         }
//         test_series_chapters: [{
//             id : number,
//             name : string,
//         }]
//         test_series_questions: [{
//             id : number,
//             name : string,
//         }]

//     }
// }
