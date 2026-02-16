import { Box, Button, FormHelperText, Grid, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionSchema, type QuestionSchemaType } from "../QuestionSchema.js";
import { useContext, useEffect, useState } from "react";
import { toastResponse } from "../../util/toastResponse.js";
import { toast } from "react-toastify";
import OptimizedTopicSearch from "./OptimizedTopicSearch.js";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField.js";
import { optionTypeData, QuestionOptionType } from "./data.js";
import SimpleTextField from "../../GlobalComponent/SimpleTextField.js";
import OptionsFieldArray from "../components/OptionsFieldArray.jsx";
import MainEditor from "../components/MainEditor.jsx";
import { AuthContext } from "@/context/AuthContext.js";
import { getAuditFields } from "@/util/audit.js";
import AuditModalButton from "@/util/AuditInfoCard.js";
// import FileUploadSection2 from "../components/FileUploadSection2.js";
import FileUploadSection2 from "../components/FileUploadThree.js";
import { GetJwt } from "@/util/utils.js";

export default function FormStructure() {
  const { user } = useContext(AuthContext);
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
  } = useForm<QuestionSchemaType>({
    defaultValues: {
      input_box: '',
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
      question_image: [],
      createdby: "",
      updatedby: "",
      createdAt: "",
      updatedAt: "",
    },
    resolver: zodResolver(QuestionSchema),
  });

  const jwt_token = GetJwt();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log("jwt_token: ", jwt_token);

  // function extractImages(html) {
  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   return [...doc.querySelectorAll("img")]
  //     .map((img) => img.src)
  //     .filter((src) => src.startsWith("data:image"));
  // }
  // function extractImagesWithAlt(html) {
  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   const images = doc.querySelectorAll("img");

  //   const imageMap = {};

  //   images.forEach((img, index) => {
  //     const alt = img.getAttribute("alt")?.trim();
  //     const src = img.getAttribute("src");

  //     if (!src?.startsWith("data:image")) return;

  //     // Fallback key if alt is missing
  //     const key = alt && alt.length > 0 ? alt : `image_${index + 1}`;

  //     imageMap[key] = src;
  //   });

  //   return imageMap;
  // }
  // const dataIOmag = extractImages(watch("question_title"));
  // const dataIOmag = extractImagesWithAlt(watch("question_title"));
  // console.log('watch("question_title"): ', watch("question_title"));
  // const rawBase64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");

  // console.log("dataIOmag: ", dataIOmag);
  // console.log("watch: ", watch("question_title"));

  useEffect(() => {
    if (!qid) return; // CREATE MODE
    const fetchQuestionById = async (
      qid: number,
    ): Promise<QuestionSchemaType> => {
      const url = `${import.meta.env.VITE_BASE_URL
        }t-questions/${qid}?populate[subject_tag]=true&populate[test_series_topic]=true&populate[options]=true&populate[test_series_exams]=true&populate[test_series_chapters]=true&populate[test_series_subject_category]=true&populate[question_image]=true`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });

      const json = await res.json();
      const item = json.data;
      console.log('item: ', item);

      if (!item) throw new Error("Question not found");

      const attr = item.attributes;

      return {
        input_box: attr?.input_box,
        question_image:
          attr?.question_image?.map((img: { id: number; url: string }) => {
            return { url: img.url, file: null };
          }) ?? [],
        createdAt: attr.createdAt,
        updatedAt: attr.updatedAt,
        createdby: attr.createdby,
        updatedby: attr.updatedby,
        difficulty: attr.difficulty?.toLowerCase(),
        explanation: attr.explanation ?? "",
        option_type: attr.option_type ?? "single_select",
        hint: attr.hint ?? "",
        question_title: attr.question_title ?? "",
        subject_tag: attr.subject_tag?.data
          ? [
            {
              id: attr.subject_tag.data.id,
              name: attr.subject_tag.data.attributes.name,
            },
          ]
          : [],
        test_series_topic: attr.test_series_topic?.data
          ? [
            {
              id: attr.test_series_topic.data.id,
              name: attr.test_series_topic.data.attributes.name,
            },
          ]
          : [],
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
      setIsSubmitting(true);
      const isEdit = Boolean(qid);

      const audit = getAuditFields(isEdit, user);
      const question_image = data?.question_image?.map((img: any) => {
        return {
          url: img.url,
        };
      });
      const wholeData = {
        ...data,
        question_image,
      };
      data = {
        ...wholeData,
        ...audit,
      };
      console.log(wholeData)

      const url = isEdit
        ? `${import.meta.env.VITE_BASE_URL}t-questions/${qid}`
        : `${import.meta.env.VITE_BASE_URL}t-questions`;
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt_token}`,
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
      // const datas = await response.json();
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
    finally {
      setIsSubmitting(false);
    }
  };

  console.log(errors)
  console.log(watch())

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

          <Grid
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <AuditModalButton
              createdby={watch("createdby")}
              createdat={watch("createdAt")}
              updatedby={watch("updatedby")}
              updatedat={watch("updatedAt")}
            />
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
        {
          watch('option_type') !== 'input_box' ?
            <Grid size={12}>
              <OptionsFieldArray
                control={control}
                setValue={setValue}
                watch={watch}
                errors={errors}
                trigger={trigger}
              />
            </Grid>
            :
            <Grid size={12}>
              <Controller
                name="input_box"
                control={control}
                rules={{
                  required: "Please enter a number",
                  validate: (val) => {
                    const strVal = String(val);
                    if (["-", ".", "-."].includes(strVal)) return "Incomplete number";
                    if (isNaN(Number(strVal))) return "Invalid number";
                    return true;
                  }
                }}
                render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                  <div style={{ marginBottom: '10px' }}>
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
                        width: '100%',         // Makes it fill the container width
                        padding: '12px 16px',  // Adds internal space (height/girth)
                        fontSize: '1.2rem',    // Makes the text larger
                        borderRadius: '8px',   // Optional: makes it look modern
                        border: error ? '2px solid red' : '1px solid #ccc',
                        boxSizing: 'border-box' // Prevents width overflow
                      }}
                    />
                    {error && (
                      <span style={{
                        color: 'red',
                        fontSize: '0.875rem',
                        display: 'block',
                        marginTop: '4px'
                      }}>
                        {error.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </Grid>

        }

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
        <Grid size={12}>
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
          <MainEditor
            name="hint"
            setValue={setValue}
            watch={watch}
            value={watch("hint")}
          />
        </Grid>
        <Grid size={12} sx={{ textAlign: "center", paddingBlock: 2 }}>
          {/* <FileUploadSection /> */}
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
    </Box >
  );
}

