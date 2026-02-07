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
import { useContext, useEffect } from "react";
import { useSlugGenerator } from "../../hooks/useSlugGenerator";
import { slugify } from "../../testSubject/components/TestSubjectForm";
import { toastResponse } from "../../util/toastResponse";
import { toast } from "react-toastify";
import { getAuditFields } from "@/util/audit";
import { AuthContext } from "@/context/AuthContext";
import AuditModalButton from "@/util/AuditInfoCard";
import { GetJwt } from "@/util/utils";

const iconOptions: Option[] = [
  { value: "math", label: "Math Icon" },
  { value: "science", label: "Science Icon" },
  { value: "geometry", label: "Geometry Icon" },
];

const TestExamCategoriesForm = () => {
  const { user } = useContext(AuthContext);

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
      is_active: true,
      createdby: "",
      updatedby: "",
      createdAt: "",
      updatedAt: ""
    },
  });

  const { id } = useParams(); // id or undefined
  const jwt_token = GetJwt()

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
        }t-categories/${id}?fields[0]=name&fields[1]=slug&fields[2]=description&fields[3]=order&fields[4]=is_active&populate[test_series_exams]=true&fields[5]=createdAt&fields[6]=updatedAt&fields[7]=createdby&fields[8]=updatedby`;
      console.log("url:", url)
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });

      const json = await res.json();
      const item = json.data;

      console.log("item:",item)

      reset({
        name: item?.attributes?.name,
        slug: item?.attributes?.slug,
        description: item?.attributes?.description,
        order: item?.attributes?.order,
        is_active: item?.attributes?.is_active,
        createdAt: item?.attributes?.createdAt,
        updatedAt: item?.attributes?.updatedAt,
        createdby: item?.attributes?.createdby,
        updatedby: item?.attributes?.updatedby,
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

      data = {
        ...data,
        ...getAuditFields(isEdit, user)
      }

      const res = await fetch(
        isEdit
          ? `${import.meta.env.VITE_BASE_URL}t-categories/${id}`
          : `${import.meta.env.VITE_BASE_URL}t-categories`,
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
        res,
        id
          ? "Updated Exam Category Successfully!"
          : "Created Exam Category Successfully!",
        id ? "Update Exam Category Failed!" : "Create Exam Category Failed!"
      );

      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      if (!id) {
        reset();
        navigate("/test-exams-category-list");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  console.log("loloo:", watch())


  return (
    <Box
      sx={{
        marginBlockStart: 7,
        bgcolor: "background.paper",
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
            {id ? "Edit Exam Category" : "Add Exam Category"}

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
              // label="Is Active"
              label={
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Is Active
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
