import React, { useContext, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import {
  TestSeriesSchema,
  TestSeriesSchemaType,
} from "../../validation/testSeriesSchema";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import useInitialDataContext from "../../addQeustion/_components/InitalContext";
import { useNavigate, useParams } from "react-router-dom";
import { useSlugGenerator } from "../../hooks/useSlugGenerator";
import { toastResponse } from "../../util/toastResponse";
import SimpleMultiAutoComplete from "../../GlobalComponent/SimpleMultiAutoComplete";
import OptimizedTopicSearch from "../../addQeustion/_components/OptimizedTopicSearch";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext.js";
import { getAuditFields } from "@/util/audit";
import AuditModalButton from "@/util/AuditInfoCard";
import { GetJwt, GetRoleType } from "@/util/utils";

const TestSeriesForm = () => {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestSeriesSchemaType>({
    resolver: zodResolver(TestSeriesSchema),
    defaultValues: {
      name: "",
      slug: "",
      order: 0,
      is_active: true,
      test_series_subject: [],
      test_series_subject_category: [],
      test_series_chapters: [],
      createdby: "",
      updatedby: "",
      createdAt:"",
      updatedAt:""
    },
  });
  const { qid } = useParams(); // qid will be string | undefined

  useSlugGenerator<TestSeriesSchemaType>({
    watch,
    setValue,
    source: "name",
    target: "slug",
  });
  const {
    data: { subjectTagData },
  } = useInitialDataContext();

  const jwt_token = GetJwt()  

  useEffect(() => {
    if (!qid) return; // no qid → create mode → don't fetch data

    const fetchData = async () => {

      let url = `${import.meta.env.VITE_BASE_URL}t-topics/${qid}?fields[0]=name&fields[1]=slug&fields[2]=is_active&fields[3]=order&populate[test_series_subject][fields]=qid&populate[test_series_subject_category][fields]=qid&populate[test_series_chapters][fields]=qid&fields[4]=createdby&fields[5]=createdAt&fields[6]=updatedby&fields[7]=updatedAt`

      const res = await fetch(url,
        {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        }
      );

      const json = await res.json();
      const item = json?.data?.attributes;
      
      console.log(item)

      // Load fetched data into form
      reset({
        createdAt:item.createdAt,
        updatedAt:item.updatedAt,
        createdby: item.createdby,
        updatedby: item.updatedby,
        name: item?.name ?? "",
        order: item?.order ?? 0,
        slug: item?.slug ?? null,
        is_active: item?.is_active ?? true,
        test_series_subject: item.test_series_subject?.data?.attributes?.name ? [
          {
            name: item.test_series_subject?.data?.attributes?.name,
            id: item.test_series_subject?.data?.id ?? 0,
          },
        ] : [],
        test_series_subject_category: item.test_series_subject_category?.data?.attributes?.name ? [
          {
            name: item.test_series_subject_category?.data?.attributes?.name,
            id: item.test_series_subject_category?.data?.id,
          },
        ] : [],
        test_series_chapters: item.test_series_chapters?.data?.map(
          (chapter: any) => ({
            id: chapter.id ?? 0,
            name: chapter?.attributes?.name ?? "",
          }),
        ),
      });
    };

    fetchData();
  }, [qid, reset]);
  const isActive = watch("is_active");

  console.log(errors)

  const onSubmit = async (data: TestSeriesSchemaType) => {
    try {
      const isEdit = Boolean(qid);

      console.log(isEdit)
      data = {
        ...data,
        ...getAuditFields(isEdit, user)
      }


      const url = isEdit
        ? `${import.meta.env.VITE_BASE_URL}t-topics/${qid}`
        : `${import.meta.env.VITE_BASE_URL}t-topics`;

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

      const result = await res.json();
      const success = await toastResponse(
        res,
        qid ? "Updated Topic Successfully!" : "Created Topic Successfully!",
        qid ? "Update Topic Failed!" : "Create Topic Failed!"
      );
      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      if (!qid) {
        reset();
        navigate("/test-topic-list");
      }

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };


  return (
    <Box
      sx={{
        marginBlockStart: 7,
        bgcolor: "background.paper",
        paddingInline: { xs: 2, sm: 3, md: 4 },
        paddingBlock: 4,
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
            {qid ? "Edit Topic" : "Add Topic"}

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
            // label="Test Topic Subject"
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
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
            control={control}
            disabled={true}
            sx={{
              cursor: "not-allowed",
              "& .MuiInputBase-root": {
                cursor: "not-allowed",
              },
              "& .MuiInputBase-input": {
                cursor: "not-allowed",
              },
            }}
            rules={{ required: "Slug is required" }}
          />
        </Grid>

        {/* SUBJECT RELATION (multi select) */}
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
            routeName="test-series-subject"
            dropdownType="single"
            fieldName="test_series_subject"
            setValue={setValue}
            watch={watch}
          />
          {/* <SimpleSelectField
            name="test_series_subject"
            control={control}
            label=""
            options={subjectTagData?.map((topic) => ({
              value: topic.id,
              label: topic?.attributes?.name,
            }))}
            placeholder="Add relation"
            rules={{ required: "Select at least one subject" }}
          /> */}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <SimpleSelectField /> */}
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
            dropdownType="single"
            fieldName="test_series_subject_category"
            routeName="test-series-subject-categorie"
            setValue={setValue}
            watch={watch}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Subject Chapters
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
          <OptimizedTopicSearch
            dropdownType="multi"
            fieldName="test_series_chapters"
            routeName="test-series-chapter"
            setValue={setValue}
            watch={watch}
          />
        </Grid>

        {/* ORDER */}
        <Grid size={{ xs: 12, md: 6 }}>
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

        {/* IS ACTIVE */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
          }}
        >
          {/* <Typography variant="subtitle1">Test Topic Subject</Typography> */}
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
            disabled={!GetRoleType()}
          >
            {qid ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestSeriesForm;
