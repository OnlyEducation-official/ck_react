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
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField";
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
      });
    };

    fetchData();
  }, [qid, reset]);
  const isActive = watch("isActive");

  const onSubmit = async (data: TestSchemaType) => {
    try {
      const isEdit = Boolean(qid);
      const url = isEdit
        ? `${import.meta.env.VITE_BASE_URL}test-series-subjects/${qid}`
        : `${import.meta.env.VITE_BASE_URL}test-series-subjects`;
      // test-series-subjects

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
        `${qid ? "Updated" : "Created"} subject successfully`,
        " subject is Failed"
      );
      const json = await res.json();
      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      // reset();
      // router.push("/exam-category");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Box p={4} borderRadius={2} sx={{ marginBlockStart: 6 }}>
      <Typography
        variant="h5"
        mb={3}
        sx={{
          mb: 2,
          fontWeight: "bold",
          pl: 2,
          borderLeft: "6px solid",
          borderColor: "primary.main",
        }}
      >
        {qid ? "Update Subject" : "Create Subject"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Order
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

          {/* isActive (toggle) */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setValue("isActive", e.target.checked)}
                />
              }
              label={
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Is Active
                  <Typography
                    variant="subtitle1"
                    component="span"
                    color="error"
                    fontWeight={700}
                    ml={0.3}
                  >
                    *
                  </Typography>
                </Typography>
              }
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
              {qid ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default TestSubjectForm;
