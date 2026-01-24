import { Box, Button, FormHelperText, Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionSchema, type QuestionSchemaType } from "../QuestionSchema.js";
import { useEffect } from "react";
import { toastResponse } from "../../util/toastResponse.js";
import { toast } from "react-toastify";
import OptimizedTopicSearch from "./OptimizedTopicSearch.js";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField.js";
import { optionTypeData, QuestionOptionType } from "./data.js";
import SimpleTextField from "../../GlobalComponent/SimpleTextField.js";
import OptionsFieldArray from "../components/OptionsFieldArray.jsx";
import MainEditor from "../components/MainEditor.jsx";
// import FileUploadSection from "../components/FileUploadSection.js";
import FileUploadSection2 from "../components/FileUploadSection2";


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
  } = useForm({
    defaultValues: {
      subject_tag: [],
      test_series_topic: [],
      difficulty: "easy",
      hint: "",
      option_type: "single_select",
      explanation: "",
      test_series_chapters: [],
      test_series_subject_category: [],
      test_series_exams: [],
      options: [
        { option_label: "A", option: "", is_correct: false },
        { option_label: "B", option: "", is_correct: false },
        { option_label: "C", option: "", is_correct: false },
        { option_label: "D", option: "", is_correct: false },
      ],
      question_title: "",
    },
    resolver: zodResolver(QuestionSchema),
  });
  function extractImages(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return [...doc.querySelectorAll("img")]
      .map((img) => img.src)
      .filter((src) => src.startsWith("data:image"));
  }
  function extractImagesWithAlt(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");

    const imageMap = {};

    images.forEach((img, index) => {
      const alt = img.getAttribute("alt")?.trim();
      const src = img.getAttribute("src");

      if (!src?.startsWith("data:image")) return;

      // Fallback key if alt is missing
      const key = alt && alt.length > 0 ? alt : `image_${index + 1}`;

      imageMap[key] = src;
    });

    return imageMap;
  }
  // const dataIOmag = extractImages(watch("question_title"));
  const dataIOmag = extractImagesWithAlt(watch("question_title"));
  // console.log('watch("question_title"): ', watch("question_title"));
  // const rawBase64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");

  console.log("dataIOmag: ", dataIOmag);
  // console.log("watch: ", watch("question_title"));

  useEffect(() => {
    if (!qid) return; // CREATE MODE
    const fetchQuestionById = async (
      qid: number,
    ): Promise<QuestionSchemaType> => {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }t-questions/${qid}?populate[subject_tag]=true&populate[test_series_topic]=true&populate[options]=true&populate[test_series_exams]=true&populate[test_series_chapters]=true&populate[test_series_subject_category]=true`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
      });

      const json = await res.json();
      const item = json.data;

      if (!item) throw new Error("Question not found");

      const attr = item.attributes;

      return {
        /** SIMPLE FIELDS */
        difficulty: attr.difficulty?.toLowerCase(), // "easy" | "medium" | "hard"
        explanation: attr.explanation ?? "",
        option_type: attr.option_type ?? "single_select",
        hint: attr.hint ?? "",
        question_title: attr.question_title ?? "",

        /** SUBJECT TAG → single object in API, array in schema */
        subject_tag: attr.subject_tag?.data
          ? [
              {
                id: attr.subject_tag.data.id,
                name: attr.subject_tag.data.attributes.name,
              },
            ]
          : [],

        /** TOPIC → Strapi returns single, schema requires an array */
        test_series_topic: attr.test_series_topic?.data
          ? [
              {
                id: attr.test_series_topic.data.id,
                name: attr.test_series_topic.data.attributes.name,
              },
            ]
          : [],

        /** TEST SERIES EXAMS → many-to-many array */
        test_series_exams:
          attr.test_series_exams?.data?.map((exam: any) => ({
            id: exam.id,
            title: exam.attributes.title,
          })) ?? [],
        test_series_chapters: attr.test_series_chapters?.data?.map(
          (chapter: any) => ({
            id: chapter.id,
            name: chapter.attributes.name,
          }),
        ),
        test_series_subject_category: attr.test_series_subject_category?.data
          ? [
              {
                id: attr.test_series_subject_category.data.id,
                name: attr.test_series_subject_category.data.attributes.name,
              },
            ]
          : [],

        /** OPTIONS → already perfect for your UI */
        options:
          attr.options?.map((opt: any) => ({
            option_label: opt.option_label,
            option: opt.option,
            is_correct: opt.is_correct,
          })) ?? [],
      };
    };
    const loadQuestion = async () => {
      try {
        const data = await fetchQuestionById(Number(qid));
        reset(data); // 🔥 FULLY WORKS WITH ZOD + RHF + CKEDITOR
      } catch (err) {
        console.error("Failed to load question", err);
      }
    };

    loadQuestion();
  }, [qid, reset]);

  const onSubmit = async (data: any) => {
    try {
      const isEdit = Boolean(qid);
      const url = isEdit
        ? `${import.meta.env.VITE_BASE_URL}t-questions/${qid}`
        : `${import.meta.env.VITE_BASE_URL}t-questions`;
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
        body: JSON.stringify({ data: data }),
      });
      const success = await toastResponse(
        response,
        qid
          ? "Updated  Question Form Successfully!"
          : "Created  Question Form Successfully!",
        qid ? "Update  Question Form Failed!" : "Create Question Form Failed!",
      );
      const datas = await response.json();
      if (!success) return; // ❌ stop if failed
      // 👉 Your next steps (optional)
      if (!qid) {
        reset();
        navigate("/questions-list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };
  // deleteDropItem

  const triggerFn = () => {
    trigger("options");
  };

  return (
    <Box
      sx={{ marginBlockStart: 6, bgcolor: "background.paper" }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid
        container
        spacing={2}
        sx={{ marginBlockStart: 10, paddingInline: 3, paddingBlockEnd: 5 }}
      >
        <Grid container size={12}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              pl: 2,
              borderLeft: "6px solid",
              borderColor: "primary.main",
            }}
          >
            {qid ? "Edit Question Form " : "Add Question Form "}
          </Typography>
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
          <OptimizedTopicSearch
            routeName="test-series-subject"
            dropdownType="single"
            fieldName="subject_tag"
            setValue={setValue}
            watch={watch}
            errors={errors?.subject_tag?.message}
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
          <OptimizedTopicSearch
            dropdownType="single"
            fieldName="test_series_subject_category"
            routeName="test-series-subject-categorie"
            setValue={setValue}
            watch={watch}
            errors={errors?.test_series_subject_category?.message}
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
          <OptimizedTopicSearch
            dropdownType="multi"
            fieldName="test_series_chapters"
            routeName="test-series-chapter"
            setValue={setValue}
            watch={watch}
            errors={errors?.test_series_chapters?.message}
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
          <OptimizedTopicSearch
            routeName="t-topic"
            dropdownType="multi"
            fieldName="test_series_topic"
            setValue={setValue}
            watch={watch}
            errors={errors?.test_series_topic?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Option Type
          </Typography>
          <SimpleSelectField
            label=""
            name="option_type"
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
            name="difficulty"
            control={control}
            // label="Test Series Topic"
            options={QuestionOptionType}
            rules={{ required: "Please select a Topic" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
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
          <SimpleTextField
            name="hint"
            control={control}
            // label="Test Series Topic"
            // options={difficultyOptions}
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
          <OptimizedTopicSearch
            dropdownType="multi"
            fieldName="test_series_exams"
            routeName="t-exam"
            setValue={setValue}
            watch={watch}
            errors={errors?.test_series_exams?.message}
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
          <MainEditor
            name="question_title"
            setValue={setValue}
            watch={watch}
            value={watch("question_title")}
          />
          {/* {errors?.question_title?.message && (
            <FormHelperText error={!!errors?.question_title?.message}>
              {errors?.question_title?.message}
            </FormHelperText>
          )} */}
        </Grid>

        {/* ---------- OPTIONS FIELD ARRAY ---------- */}
        <Grid size={12}>
          <OptionsFieldArray
            control={control}
            setValue={setValue}
            watch={watch}
            errors={errors}
            trigger={trigger}
          />
        </Grid>
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
          <MainEditor
            name="explanation"
            setValue={setValue}
            watch={watch}
            value={watch("explanation")}
          />
          {errors?.explanation?.message && (
            <FormHelperText error={!!errors?.explanation?.message}>
              {errors?.explanation?.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid size={12} sx={{ textAlign: "center", paddingBlock: 2 }}>
          {/* <FileUploadSection /> */}
          <FileUploadSection2 />
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
          >
            {qid ? "Update" : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
