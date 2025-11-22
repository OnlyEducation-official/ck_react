import { Box, Button, Grid, Typography } from "@mui/material";
import SimpleSelectField, {
  Option,
} from "../../GlobalComponent/SimpleSelectField";
import {
  Control,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { QuestionSchemaType } from "../QuestionSchema";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import MainEditor from "../components/MainEditor";
import OptionsFieldArray from "../components/OptionsFieldArray";
import {
  difficultyOptions,
  dummySubject,
  dummyTopics,
  optionTypeData,
  optionLabel
} from "./data";
import useInitialDataContext from "./InitalContext";
import { useEffect, useState } from "react";

export default function FormStructure({
  control,
  watch,
  setValue,
}: {
  control: Control<QuestionSchemaType>;
  watch: UseFormWatch<QuestionSchemaType>;
  setValue: UseFormSetValue<QuestionSchemaType>;
}) {

  const {
    data: { subjectTagData, topicTagData, tExamsData },
    setSubject,
  } = useInitialDataContext();

  useEffect(() => {
    setSubject(watch("subject_tag"))
  },[watch("subject_tag")])  
  
  return (
    <Grid
      container
      spacing={3}
      sx={{ marginBlockStart: 10, paddingInline: 3, paddingBlockEnd: 5 }}
    >
      <Grid container size={12}>
        <Typography variant="h4">Question Form</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Typography variant="subtitle1">Select subject</Typography>
        <SimpleSelectField
          label=""
          name="subject_tag"
          control={control}
          // label="Select Subject"
          options={
            subjectTagData?.map((subject) => ({
              value: subject.id,
              label: subject.attributes.name,
            })) as Option[]
          }
          rules={{ required: "Please select a subject" }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        {/* <SimpleSelectField /> */}
        <Typography variant="subtitle1">Select topic</Typography>
        <SimpleSelectField
          label=""
          name="test_series_topic"
          control={control}
          // label="Test Series Topic"
          options={
            topicTagData?.map((topic) => ({
              value: topic.id,
              label: topic.attributes.name,
            })) as Option[]
          }
          rules={{ required: "Please select a Topic" }}
          disabled={watch("subject_tag") == 0 ? true : false}
        />
      </Grid>
      {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Typography variant="subtitle1">Select Exams</Typography>
        <SimpleSelectField
          label=""
          name="test_series_exams"
          control={control}
          options={
            tExamsData?.map((exam) => ({
              value: exam.id,
              label: exam.attributes.title,
            })) as Option[]
          }
          rules={{ required: "Please select a Topic" }}
        />
      </Grid> */}
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        {/* <SimpleSelectField /> */}
        <Typography variant="subtitle1">Marks</Typography>
        <SimpleTextField
          name="marks"
          control={control}
          // label="Marks"
          type="number"
          placeholder="Enter marks"
          rules={{ min: { value: 1, message: "Marks must be at least 1" } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        {/* <SimpleSelectField /> */}
        <Typography variant="subtitle1">Difficulty</Typography>
        <SimpleSelectField
          label=""
          name="difficulty"
          control={control}
          // label="Test Series Topic"
          options={difficultyOptions}
          rules={{ required: "Please select a Topic" }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        {/* <SimpleSelectField /> */}
        <Typography variant="subtitle1">Option type</Typography>
        <SimpleSelectField
          label=""
          name="option_type"
          control={control}
          // label="Test Series Topic"
          options={optionTypeData}
          rules={{ required: "Please select a Topic" }}
          noneOption={false}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        {/* <SimpleSelectField /> */}
        <Typography variant="subtitle1">Hint</Typography>
        <SimpleTextField
          name="hint"
          control={control}
          // label="Test Series Topic"
          // options={difficultyOptions}
          rules={{ required: "Please select a Topic" }}
        />
      </Grid>
      <Grid container size={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Question Title</Typography>
          <MainEditor
            name="question_title"
            value={watch("question_title")}
            setValue={setValue}
            watch={watch}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Explaination</Typography>
          <MainEditor
            name="explanation"
            value={watch("explanation")}
            setValue={setValue}
            watch={watch}
          />
        </Grid>
      </Grid>
      <Grid size={12}>
        <OptionsFieldArray
          watch={watch}
          control={control}
          setValue={setValue}
        />
      </Grid>
      <Grid size={12} sx={{ textAlign: "center", paddingBlock: 2 }}>
        <Button variant="contained" type="submit" sx={{ paddingInline: 10 }}>
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}
