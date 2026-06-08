import {
  Box,
  Button,
  FormHelperText,
  Grid,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toastResponse } from "../../util/toastResponse.js";
import { toast } from "react-toastify";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField.js";
import { optionTypeData, QuestionOptionType } from "./data.js";
import OptionsFieldArray from "../components/OptionsFieldArray.jsx";
import FileUploadSection2 from "../components/FileUploadThree.js";
import { GetJwt } from "@/util/utils.js";
import EditorComponent from "@/components/EditorComponent.js";
import SelectField from "@/components/SelectField.js";
import { api } from "@/lib/api.js";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types/generic.api.types.js";
import type { TQuestion, TQuestionRelation } from "@/types/Question.types.js";
import { questionSchemaCreate, TQuestionSchemaCreate } from "../QuestionSchema.js";
import { SimpleAutocomplete } from "@/GlobalComponent/SimpleAutocomplete.js";
import OptimizedSelect from "./OptimizedTopicSearch.js";
import { AsyncAutocomplete } from "@/GlobalComponent/AsyncAutocomplete.js";
import { getAllChapters, getAllExamCategories, getAllSubjects, getAllSubjectsCategories, getAllTopics } from "@/getAll/api/subjectApi.js";
import { AsyncMultiAutocomplete } from "@/GlobalComponent/AsyncMultiAutocomplete.js";

type EditAutocompleteOptions = {
  subjects: TQuestionRelation[];
  topics: TQuestionRelation[];
  chapters: TQuestionRelation[];
  subjectCategories: TQuestionRelation[];
  examCategories: TQuestionRelation[];
};

const emptyEditAutocompleteOptions: EditAutocompleteOptions = {
  subjects: [],
  topics: [],
  chapters: [],
  subjectCategories: [],
  examCategories: [],
};

const getRelationIds = (
  ids: number[] | null | undefined,
  fallback: TQuestionRelation[] = [],
) => (ids?.length ? ids : fallback.map(({ id }) => id));

const getFirstId = (ids: number[] | null | undefined) => ids?.[0];

export default function FormStructure() {
  const { qid } = useParams();
  const navigate = useNavigate();
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<TQuestionSchemaCreate>({
    defaultValues: {
      // input_box: "",
      subjectIds: 0,
      topicIds: [],
      difficultyLevel: "easy",
      hint: "",
      optionType: "Single",
      explanation: "",
      chapterIds: [],
      subjectCategoryIds: [],
      examCategoryIds: [],
      options: [
        { name: "", isCorrect: false },
        { name: "", isCorrect: false },
        { name: "", isCorrect: false },
        { name: "", isCorrect: false },
      ],
      question: "",
      images: [],

    },
    resolver: zodResolver(questionSchemaCreate),
  });
  console.log('watch: ', watch());

  const jwt_token = GetJwt();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editAutocompleteOptions, setEditAutocompleteOptions] =
    useState<EditAutocompleteOptions>(emptyEditAutocompleteOptions);

  useEffect(() => {
    if (!qid) {
      setEditAutocompleteOptions(emptyEditAutocompleteOptions);
      return;
    }
    const fetchQuestionById = async (
      qid: number,
    ): Promise<TQuestionSchemaCreate | null> => {

      const res = await api<ApiSuccessResponse<TQuestion> | ApiErrorResponse>(`questions/${qid}`, {
        method: "GET",
      });


      if (!res.success) return null;

      const data = res.data;
      console.log('data: ', data);
      setEditAutocompleteOptions({
        subjects: data.subjects ?? [],
        topics: data.topics ?? [],
        chapters: data.chapters ?? [],
        subjectCategories: data.subjectCategories ?? [],
        examCategories: data.examCategories ?? [],
      });

      return {
        // input_box: data?.input_box || "",
        images: data?.images,
        difficultyLevel: data.difficultyLevel || "easy",
        explanation: data.explanation ?? "",
        optionType: data.optionType ?? "Single",
        hint: data.hint ?? "",
        question: data.question ?? "",
        subjectIds: getFirstId(data?.subjectIds) ?? data.subjects?.[0]?.id,
        topicIds: getRelationIds(data?.topicIds, data.topics),
        examCategoryIds: getRelationIds(data?.examCategoryIds, data.examCategories),
        chapterIds: getRelationIds(data?.chapterIds, data.chapters),
        subjectCategoryIds: getRelationIds(data?.subjectCategoryIds, data.subjectCategories),
        options: data.options,
      };
    };
    const loadQuestion = async () => {
      try {
        const data = await fetchQuestionById(Number(qid));
        if (data) reset(data);
      } catch (err) {
        console.error("Failed to load question", err);
      }
    };

    loadQuestion();
  }, [qid, reset]);
  const getData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}subjects`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onSubmit = async (data: TQuestionSchemaCreate) => {
    console.log('data: ', data);
    try {
      setIsSubmitting(true);
      const isEdit = Boolean(qid);

      // const question_image = data?.images?.map((img: any) => {
      //   return {
      //     url: img.url,
      //   };
      // });
      // const wholeData = {
      //   ...data,
      //   question_image,
      // };
      data = {
        ...data,
        subjectIds: data.subjectIds,
      };

      const url = isEdit
        ? `${import.meta.env.VITE_BASE_URL}questions/${qid}`
        : `${import.meta.env.VITE_BASE_URL}questions`;
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const success = await toastResponse(
        response,
        qid
          ? "Updated  Question Form Successfully!"
          : "Created  Question Form Successfully!",
        qid ? "Update  Question Form Failed!" : "Create Question Form Failed!",
      );
      if (!success) return; // ❌ stop if failed
      if (!qid) {
        reset();
        navigate("/questions-list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        marginBlockStart: 6,
        bgcolor: "background.paper",
        pointerEvents: isSubmitting ? "none" : "auto",
        opacity: isSubmitting ? 0.6 : 1,
        transition: "opacity 0.2s ease",
      }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Grid
        container
        spacing={2}
        sx={{ marginBlockStart: 10, paddingInline: 3, paddingBlockEnd: 5 }}
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
              {qid ? "Edit Question Form" : "Add Question Form"}
            </Typography>
          </Grid>

        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Select subject
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
          <AsyncAutocomplete
            name="subjectIds"
            control={control}
            // label="Subject"
            placeholder="Search subject…"
            queryKey={["subjects"]}
            getOptionLabel={(s) => s.name}
            queryFn={getAllSubjects}
            getOptionValue={(s) => s.id}
            defaultOption={editAutocompleteOptions.subjects[0] ?? null}
          />

        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Subject Category
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

          <AsyncMultiAutocomplete
            name="subjectCategoryIds"
            control={control}
            // label="Subject Categories"
            required
            placeholder="Search subjects categories…"
            queryKey={["subject-categorys"]}
            queryFn={getAllSubjectsCategories}
            getOptionLabel={(s) => s.name}
            getOptionValue={(s) => s.id}
            defaultOptions={editAutocompleteOptions.subjectCategories}
          />

        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

          <AsyncMultiAutocomplete
            name="chapterIds"
            control={control}
            // label="Chapters"
            required
            placeholder="Search Chapters..."
            queryKey={["chapters"]}
            queryFn={getAllChapters}
            getOptionLabel={(s) => s.name}
            getOptionValue={(s) => s.id}
            defaultOptions={editAutocompleteOptions.chapters}
          />

        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {" "}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Select Topic
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
          <AsyncMultiAutocomplete
            name="topicIds"
            control={control}
            // label="Topics"
            required
            placeholder="Search Topics..."
            queryKey={["topics"]}
            queryFn={getAllTopics}
            getOptionLabel={(s) => s.name}
            getOptionValue={(s) => s.id}
            defaultOptions={editAutocompleteOptions.topics}
          />

        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Option Type
          </Typography>
          <SimpleSelectField
            label=""
            name="optionType"
            control={control}
            // label="Test Series Topic"
            options={optionTypeData}
            rules={{ required: "Please select a Topic" }}
            myCallBackFn={() => trigger("options")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Select Difficulty Level
          </Typography>
          <SimpleSelectField
            label=""
            name="difficultyLevel"
            control={control}
            // label="Test Series Topic"
            options={QuestionOptionType}
            rules={{ required: "Please select a Topic" }}
          />
        </Grid>
        {/* Test series Exam */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Test Series Exam
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
          {/* <SelectField
            name="examCategoryIds"
            label=""
            control={control}
            route="exam-category"
            multiple
            rules={{
              required: "At least one exam category required",
            }}
          /> */}
          <AsyncMultiAutocomplete
            name="examCategoryIds"
            control={control}
            // label="Exam Category"
            required
            placeholder="Search Exam Category..."
            queryKey={["examCategories"]}
            queryFn={getAllExamCategories}
            getOptionLabel={(s) => s.name}
            getOptionValue={(s) => s.id}
            defaultOptions={editAutocompleteOptions.examCategories}
          />
        </Grid>
        {/* ---------- QUESTION FIELD ---------- */}
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Question
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

          <EditorComponent name="question" control={control} />
        </Grid>
        {/* ---------- OPTIONS FIELD ARRAY ---------- */}
        {watch("optionType") !== "Numerical" ? (
          <Grid size={12}>
            <OptionsFieldArray
              control={control}
              setValue={setValue}
              watch={watch}
              errors={errors}
              trigger={trigger}
            />
          </Grid>
        ) : (
          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Enter Numeric Value
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
            <Controller
              name="input_box"
              control={control}
              rules={{
                required: "Please enter a number",
                validate: (val) => {
                  const strVal = String(val);
                  if (["-", ".", "-."].includes(strVal))
                    return "Incomplete number";
                  if (isNaN(Number(strVal))) return "Invalid number";
                  return true;
                },
              }}
              render={({
                field: { onChange, value, ...field },
                fieldState: { error },
              }) => (
                <div style={{ marginBottom: "10px" }}>
                  <input
                    {...field}
                    value={value ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^-?\d*\.?\d*$/.test(val) || val === "") {
                        onChange(val);
                      }
                    }}
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "1.2rem",
                      borderRadius: "8px",
                      border: error ? "2px solid red" : "1px solid #ccc",
                      boxSizing: "border-box",
                    }}
                  />
                  {error && (
                    <span
                      style={{
                        color: "red",
                        fontSize: "0.875rem",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </Grid>
        )}

        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Explaination
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

          <EditorComponent name="explanation" control={control} />
          {errors?.explanation?.message && (
            <FormHelperText error={!!errors?.explanation?.message}>
              {errors?.explanation?.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Hint
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

          <EditorComponent name="hint" control={control} />
        </Grid>
        <Grid size={12} sx={{ textAlign: "center", paddingBlock: 2 }}>
          <FileUploadSection2
            control={control}
            watch={watch}
            setValue={setValue}
          />
        </Grid>
        <Grid size={12} sx={{ textAlign: "center", paddingBlock: 2 }}>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : qid ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
