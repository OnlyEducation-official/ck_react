import { useFieldArray, useForm } from "react-hook-form";
import MainEditor from "../components/MainEditor";
import QuestionCard from "./QuestionCard";
import SelectComponent from "./SelectComponent";
import { Box, Button, Container, Grid } from "@mui/material";
import { useCallback } from "react";
import CheckBox from "./CheckBox";
import useInitialDataContext from "../addQeustion/_components/InitalContext";


export default function QuestionPreview() {

  const getInitalData = useInitialDataContext();
  console.log(getInitalData)

  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      question_title: "abc",
      explanation: "asdasdasdasd ",
      subject_tag: 6,
      options: [
        {
          option_label: "A",
          is_correct: true,
          option: "sdasds asd asda ",
          media: "",
        },
        {
          option_label: "B",
          is_correct: false,
          option: "sdasds asd asda ",
        },
        {
          option_label: "C",
          is_correct: false,
          option: "sdasds asd asda ",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "options",
  });

  const handleEditorChange = useCallback((html, { docId }) => {
    setValue(docId, html);
  }, []);

  const onSubmitt = async (data) => {
    const response = await fetch(
      "https://admin.onlyeducation.co.in/api/t-questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`
        },
        body: JSON.stringify({ data: data }),
      }
    );
    const datas = await response.json();
  };

  return (
    <Container maxWidth="xl" sx={{ marginBlockStart: 6 }}>
      <Box
        component={"form"}
        onSubmit={handleSubmit(onSubmitt)}
        sx={{ paddingBlockEnd: 6 }}
      >
        <div className="flex flex-col gap-4 py-12">
          <div>
            <h1 className="text-xl">{`1) Question title`}</h1>
            <MainEditor
              docId={"question_title"}
              onChange={handleEditorChange}
            />
          </div>
          <div>
            <h2 className="text-xl">{`2) Question Explaination`}</h2>
            <MainEditor docId={"explanation"} onChange={handleEditorChange} />
          </div>
          <Grid container spacing={2}>
            {fields.map((field, index) => (
              <Grid
                size={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  border: "1px solid grey",
                  padding: 2,
                  borderRadius: 2,
                }}
                key={field.id}
              >
                <Box>Option {index + 1}</Box>
                <SelectComponent
                  control={control}
                  name={`options.${index}.option_label`}
                  label="Option_Label"
                  // value={watch(`options.${index}.option_label`)} name={`options.${index}.option_label`} setValue={setValue}
                />
                <Box>
                  <CheckBox
                    checked={watch(`options.${index}.is_correct`)}
                    name={`options.${index}.is_correct`}
                    setValue={setValue}
                  />
                </Box>
                {/* <Box>
                                <Button variant={watch(`options.${index}.is_correct`) === true ? 'contained' : 'outlined'}>True</Button>
                                <Button variant={watch(`options.${index}.is_correct`) === true ? 'contained' : 'outlined'}>False</Button>
                            </Box> */}
                <h2 className="text-xl">Option</h2>
                <MainEditor
                  docId={`options.${index}.option`}
                  onChange={handleEditorChange}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ paddingBlockStart: 6 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                append({ option_label: "", is_correct: false, option: "" })
              }
            >
              Add Option
            </Button>
          </Box>
        </div>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </Container>
  );
}
