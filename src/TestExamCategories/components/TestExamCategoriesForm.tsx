import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import SimpleSelectField, {
  Option,
} from "../../GlobalComponent/SimpleSelectField";
import {
  TestExamSchema,
  TestSeriesExamType,
} from "../../validation/testSeriesExamCategorySchema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import { useEffect } from "react";
import { useSlugGenerator } from "../../hooks/useSlugGenerator";
import { slugify } from "../../testSubject/components/TestSubjectForm";
import { toastResponse } from "../../util/toastResponse";
import { toast } from "react-toastify";

const iconOptions: Option[] = [
  { value: "math", label: "Math Icon" },
  { value: "science", label: "Science Icon" },
  { value: "geometry", label: "Geometry Icon" },
];

const TestExamCategoriesForm = () => {
  const navigate = useNavigate();
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestSeriesExamType>({
    resolver: zodResolver(TestExamSchema),
    defaultValues: {
      name: "",
      slug: null,
      description: "",
      order: 0,
      is_active: false,
    },
  });

  const { id } = useParams(); // id or undefined

  useSlugGenerator<TestSeriesExamType>({
    watch,
    setValue,
    source: "name",
    target: "slug",
  });


  const {
    data: { tExamsData },
  } = useInitialDataContext();

  useEffect(() => {
    if (!id) return; // CREATE mode

    const fetchItem = async () => {
      const url = `${import.meta.env.VITE_BASE_URL
        }t-categories/${id}?fields[0]=name&fields[1]=slug&fields[2]=description&fields[3]=order&fields[4]=is_active&populate[test_series_exams]=true`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
      });

      const json = await res.json();
      const item = json.data;

      reset({
        name: item?.attributes?.name,
        slug: item?.attributes?.slug,
        description: item?.attributes?.description,
        order: item?.attributes?.order,
        is_active: item?.attributes?.is_active,
      });
    };

    fetchItem();
  }, [id, reset]);

  const nameValue = watch("name");
  useEffect(() => {
    if (!nameValue) return;
    setValue("slug", slugify(nameValue));
  }, [nameValue, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const isEdit = Boolean(id);
      const res = await fetch(
        isEdit
          ? `${import.meta.env.VITE_BASE_URL}t-categories/${id}`
          : `${import.meta.env.VITE_BASE_URL}t-categories`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
          },
          body: JSON.stringify({
            data: data,
          }),
        }
      );
      const success = await toastResponse(
        res,
        id
          ? "Updated Exam Category Successfully!"
          : "Created Exam Category Successfully!",
        id ? "Update Exam Category Failed!" : "Create Exam Category Failed!"
      );

      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      if(!id) { 
        reset();
        navigate("/test-exams-category-list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

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
        {id ? "Edit Exam Category" : "Add Exam Category"}
      </Typography>

      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
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
              label=""
              rules={{ required: "Name is required" }}
              fullWidth
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
              disabled
              control={control}
              label=""
              fullWidth
              sx={{
                cursor: "not-allowed",
                "& .MuiInputBase-root": {
                  cursor: "not-allowed",
                },
                "& .MuiInputBase-input": {
                  cursor: "not-allowed",
                },
              }}
            />
          </Grid>

          {/* ORDER */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: "fit-content" }}>
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
          <Grid size={{ xs: 12, md: 6 }}>
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

          {/* isActive (toggle) */}
          <Grid size={{ xs: 12, md: 6 }} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={watch("is_active")}
                  onChange={(e) => setValue("is_active", e.target.checked)}
                />
              }
              label="Is Active"
            />
          </Grid>

          {/* SUBMIT BUTTON */}
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
              {id ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
        <Grid>{/* <TopicsPage /> */}</Grid>
      </Box>
    </Box>
  );
};

export default TestExamCategoriesForm;
