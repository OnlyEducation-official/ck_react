import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, Typography } from "@mui/material";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GetRoleType } from "@/util/utils";
import { api } from "@/lib/api";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types/generic.api.types";
import { useQueryClient } from "@tanstack/react-query";

const SubjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type SubjectSchemaType = z.infer<typeof SubjectSchema>;

const TestSubjectForm = () => {
  const queryClient = useQueryClient();
  const { qid } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitted, isSubmitting },
  } = useForm<SubjectSchemaType>({
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!qid) return;

    const fetchData = async () => {
      const response = await api<ApiSuccessResponse<SubjectSchemaType> | ApiErrorResponse>(
        `subjects/${qid}`
      );

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      reset({ name: response.data?.name ?? "" });
    };

    fetchData();
  }, [qid, reset]);

  const onSubmit = async (data: SubjectSchemaType) => {
    try {
      const isEdit = Boolean(qid);
      const url = isEdit ? `subjects/${qid}` : `subjects`;

      const res = await api<ApiSuccessResponse<SubjectSchemaType> | ApiErrorResponse>(url, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        method: isEdit ? "PUT" : "POST",
      });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        if (!isEdit) {
          reset();
          navigate("/test-subject-list");
        };
        await queryClient.invalidateQueries({
          queryKey: ["subjects"],
        });
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
            sx={{ fontWeight: 800, pl: 2, borderLeft: "6px solid", borderColor: "primary.main" }}
          >
            {qid ? "Edit Subject" : "Add Subject"}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Name
            <Typography variant="subtitle1" component="span" color="error" fontWeight={700} marginLeft={0.2}>
              *
            </Typography>
          </Typography>
          <SimpleTextField
            name="name"
            control={control}
            placeholder="Add name"
            rules={{ required: "Name is required" }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              px: 5, py: 1,
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
            disabled={!GetRoleType() || (!isValid && isSubmitted) || isSubmitting}
          >
            {qid ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestSubjectForm;