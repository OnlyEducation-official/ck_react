import { useEffect } from "react";
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
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { toastResponse } from "../../util/toastResponse";

export const slugify = (text: string): string => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};
const TestSubjectForm = () => {
  const {
    data: { tExamsData },
  } = useInitialDataContext();
  const { qid } = useParams();
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestSchemaType>({
    resolver: zodResolver(TestSchema),
    defaultValues: {
      name: "",
      slug: null,
      order: 0,
      test_series_exams: null,
      //   icon: null,
      isActive: true,
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
      const url = `${
        import.meta.env.VITE_BASE_URL
      }test-series-subjects/${qid}?populate=*`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
      });
      console.log("res: ", res);

      const json = await res.json();
      console.log("json: ", json);
      const item = json?.data?.attributes;
      console.log("item: ", item);
      reset({
        name: item?.name ?? "",
        order: item?.order ?? 0,
        slug: item?.slug ?? null,
        isActive: item?.is_active ?? true,
        // is_active: item?.isActive ?? true,
        test_series_exams: item?.test_series_exams?.data[0]?.id ?? 0,
      });
    };

    fetchData();
  }, [qid, reset]);
  const isActive = watch("isActive");

  const onSubmit = async (data: TestSchemaType) => {
    const isEdit = Boolean(qid);

    const url = isEdit
      ? `${import.meta.env.VITE_BASE_URL}test-series-subjects/${qid}`
      : `${import.meta.env.VITE_BASE_URL}test-series-subjects`;
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

    toastResponse(
      res,
      `${qid ? "Updated" : "Created"} subject successfully`,
      " subject is Failed"
    );
    const json = await res.json();
  };

  return (
    <Box p={4} borderRadius={2}>
      <Typography variant="h6" mb={3}>
        {qid ? "Update" : "Create"} Test Subject
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1">Slug</Typography>
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
            <Typography variant="subtitle1">test Series Exams</Typography>
            <SimpleSelectField
              name="test_series_exams"
              control={control}
              label=""
              // options={[
              //   { value: 0, label: "0" },
              //   { label: "1", value: 1 },
              // ]}
              options={
                tExamsData?.map((exam) => ({
                  value: exam.id,
                  label: exam.attributes.title,
                })) as Option[]
              }
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
                  onChange={(e) => setValue("isActive", e.target.checked)}
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

export default TestSubjectForm;
