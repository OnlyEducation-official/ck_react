import React from "react";
import MainEditor from "./components/MainEditor";
import Grid from "@mui/material/Grid";
import { Box, Button, Typography } from "@mui/material";
import SimpleSelectField, {
  Option,
} from "../GlobalComponent/SimpleSelectField";
import { useFieldArray, useForm } from "react-hook-form";
import { QuestionSchema, QuestionSchemaType } from "./QuestionSchema";
// import Typography from "@mui/material/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleTextField from "../GlobalComponent/SimpleTextField";
import OptionsFieldArray from "./components/OptionsFieldArray";

const dummySubject = [
  { id: 7, title: "chemistry" },
  { id: 5, title: "amthematics" },
  { id: 6, title: "physics" },
];

export const dummyTopics = [
  { id: 147, title: "Electrochemistry" },
  { id: 148, title: "Acid-Base Equilibria" },
  { id: 149, title: "Thermodynamics" },
  { id: 150, title: "Thermochemistry" },
  { id: 151, title: "Qualitative Analysis" },
  { id: 152, title: "Organic Named Reactions" },
  { id: 153, title: "Organic Qualitative Analysis" },
  { id: 116, title: "Polynomials" },
  { id: 117, title: "Probability" },
  { id: 118, title: "Differentiability" },
  { id: 119, title: "Matrices" },
  { id: 120, title: "3D Geometry" },
  { id: 121, title: "Functions" },
];
const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];
export const optionLabelOptions = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
  { label: "D", value: "D" },
];
export default function Index() {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject_tag: 0,
      test_series_topic: 0,
      test_series_exams: [],
      marks: 0,
      difficulty: "easy",
      explanation: "",
      option_type: "input_box",
      options: [{ option_label: "A", option: "", is_correct: false }],
    },
    // resolver: zodResolver(QuestionSchema),
  });
  console.log("errors: ", errors);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  console.log("watch: ", watch());
  const onSubmitt = async (data: any) => {
    console.log("submit", data);
    // const payload = {
    //     data: data
    // };
    // console.log('payload: ', payload);
    const response = await fetch(
      "https://admin.onlyeducation.co.in/api/t-questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 396dcb5c356426f8c3ce8303bcdc6feb5ecb1fd4aa4aaa59e42e1c7f82b6385cf4107d023cc58cfd61294adb023993a8e58e0aad8759fbf44fc020c1ac02f492c9d42d1f7dc12fc05c8144fbe80f06850c79d4b823241c83c5e153b03d1f8d0316fb9dec1a531c0df061e1f242bab549f17f715b900ba9546f6a6351fdd7dfa8",
        },
        body: JSON.stringify({ data: data }),
      }
    );
    const datas = await response.json();
    console.log("response", datas);
  };
  return (
    <Grid
      container
      component={"form"}
      onSubmit={handleSubmit(onSubmitt)}
      sx={{ marginBlockStart: 10, paddingInline: 3 }}
    >
      <Grid size={12}>
        {/* <SimpleSelectField /> */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            subject tag
          </Typography>
          <SimpleSelectField
            name="subject_tag"
            control={control}
            label="Select Subject"
            options={
              dummySubject.map((s) => ({
                value: s.id.toString(),
                label: s.title,
              })) as Option[]
            }
            rules={{ required: "Please select a subject" }}
          />
        </Box>
      </Grid>
      <Grid size={12}>
        {/* <SimpleSelectField /> */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          test series topic
        </Typography>
        <SimpleSelectField
          name="test_series_topic"
          control={control}
          label="Test Series Topic"
          options={
            dummyTopics.map((s) => ({
              value: s.id.toString(),
              label: s.title,
            })) as Option[]
          }
          rules={{ required: "Please select a Topic" }}
        />
      </Grid>
      <Grid size={12}>
        {/* <SimpleSelectField /> */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          marks
        </Typography>
        <SimpleTextField
          name="marks"
          control={control}
          label="Marks"
          type="number"
          placeholder="Enter marks"
          rules={{ min: { value: 1, message: "Marks must be at least 1" } }}
        />
      </Grid>
      <Grid size={12}>
        {/* <SimpleSelectField /> */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          difficulty
        </Typography>
        <SimpleSelectField
          name="difficulty"
          control={control}
          label="Test Series Topic"
          options={difficultyOptions}
          rules={{ required: "Please select a Topic" }}
        />
      </Grid>
      <Grid size={12}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Question Title
          </Typography>
        </Box>
        {/* <MainEditor
          name="question_title"
          value={watch("question_title")}
          setValue={setValue}
          watch={watch}
        /> */}
      </Grid>
      <Grid size={12}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="h5"
            className="text-xl"
          >{`2) Question Explaination`}</Typography>
          <MainEditor
            name="explanation"
            value={watch("explanation")}
            setValue={setValue}
            watch={watch}
          />
        </Box>
      </Grid>
      <Grid size={12}>
        <OptionsFieldArray
          watch={watch}
          control={control}
          setValue={setValue}
        />
      </Grid>

      <Grid size={12} sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="h5"
            className="text-xl"
          >{`3) Options`}</Typography>
        </Box>
      </Grid>
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Grid>
  );
}
