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
import {
  TestSchema,
  TestSchemaType,
} from "../../validation/testSeriesSubjectSchema";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import SimpleSelectField, {
  Option,
} from "../../GlobalComponent/SimpleSelectField";
import {
  TestExamSchema,
  TestSeriesExamType,
} from "../../validation/testSeriesExamCategorySchema";
import { useLocation, useParams } from "react-router-dom";
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import { useEffect } from "react";
import { useSlugGenerator } from "../../hooks/useSlugGenerator";

const iconOptions: Option[] = [
  { value: "math", label: "Math Icon" },
  { value: "science", label: "Science Icon" },
  { value: "geometry", label: "Geometry Icon" },
];

const TestExamCategoriesForm = () => {
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
      test_series_exams: null,
      is_active: false,
    },
  });
  const { id } = useParams(); // id or undefined
  // console.log('id: ', id);
  useSlugGenerator<TestSeriesExamType>({
    watch,
    setValue,
    source: "name",
    target: "slug",
  });
  // console.log('watch: ', watch());

  const location = useLocation();
  // console.log(location);

  const isActive = watch("is_active");
  const { tExamsData } = useInitialDataContext();
  // console.log("getData: ", tExamsData);
  useEffect(() => {
    if (!id) return; // CREATE mode

    const fetchItem = async () => {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }t-categories/${id}?populate=*`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
      });

      const json = await res.json();
      const item = json.data;
      console.log("item: ", item);
      console.log(
        "item.attributes.test_series_exams?.data?.id: ",
        item.attributes.test_series_exams?.data?.[0].id
      );
      console.log("item.attributes.isActive: ", item.attributes.isActive);

      reset({
        name: item?.attributes?.name,
        slug: item?.attributes?.slug,
        description: item?.attributes?.description,
        order: item?.attributes?.order,
        test_series_exams:
          item?.attributes?.test_series_exams?.data?.[0].id ?? null,
        is_active: item?.attributes?.isActive,
      });
    };

    fetchItem();
  }, [id, reset]);

  const onSubmit = async (data: TestSchemaType) => {
    console.log("POST DATA:", data);

    const isEdit = Boolean(id);

    const url = isEdit
      ? `${import.meta.env.VITE_BASE_URL}t-categories/${id}`
      : `${import.meta.env.VITE_BASE_URL}t-categories`;
    // test-series-subjects
    const method = isEdit ? "PUT" : "POST";

    const body = JSON.stringify({
      data: data,
    });

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
      },
      body,
    });
  };

  return (
    <Box p={4} borderRadius={2}>
      <Typography variant="h6" mb={3}>
        Create Test Series Category
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* NAME */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1">Name</Typography>
            <SimpleTextField
              name="name"
              control={control}
              label=""
              rules={{ required: "Name is required" }}
              fullWidth
            />
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
              // isOptionEqualToValue={
              //   watch("order") === 0
              //     ? (a, b) => a.value === b.value
              //     : (a, b) => a.value === b.value
              // }
              noneOption={false}
              // placeholder="Add relation"
              rules={{ required: "Select at least one subject" }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1">Description</Typography>
            <SimpleTextField
              name="description"
              control={control}
              label=""
              rules={{ required: "Description is required" }}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1">Test Series Exams</Typography>
            <SimpleSelectField
              name="test_series_exams"
              control={control}
              label=""
              options={tExamsData?.map((exam) => ({
                label: exam.attributes.title,
                value: exam.id,
              }))}
              noneOption={false}
              rules={{ required: "Select at least one subject" }}
            />
          </Grid>

          {/* isActive (toggle) */}
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

          {/* SUBMIT BUTTON */}
          <Grid size={{ xs: 12 }}>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default TestExamCategoriesForm;
