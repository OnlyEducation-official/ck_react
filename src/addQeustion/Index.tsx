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
      explanation: "",
      option_type: "input_box",
      options: [{ option_label: "A", option: "", is_correct: false }],
    },
    // resolver: zodResolver(QuestionSchema),
  });
  console.log("errors: ", errors);

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
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmitt)}
    >
      <FormStructure control={control} setValue={setValue} watch={watch} />
    </Box>
  );
}
