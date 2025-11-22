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
import FormStructure from "./_components/FormStructure";


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
      hint: "",
      option_type: "single_select",
      explanation: "",
      options: [
        { option_label: "A", option: "", is_correct: false },
        { option_label: "B", option: "", is_correct: false },
        { option_label: "C", option: "", is_correct: false },
        { option_label: "B", option: "", is_correct: false },
      ],
    },
    resolver: zodResolver(QuestionSchema),
    // resolver: zodResolver(QuestionSchema),
  });


  const onSubmitt = async (data: any) => {
    const response = await fetch(
      "https://admin.onlyeducation.co.in/api/t-questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
        body: JSON.stringify({ data: data }),
      }
    );
    const datas = await response.json();
  };
  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmitt)}
    >
      <FormStructure control={control} setValue={setValue} watch={watch} />
    </Box>
  );
}
