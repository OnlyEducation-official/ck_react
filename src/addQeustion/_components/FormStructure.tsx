import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { QuestionSchema, QuestionSchemaType } from "../QuestionSchema";
import SimpleTextField from "../../GlobalComponent/SimpleTextField";
import { difficultyOptions, optionTypeData } from "./data";
import TopicSearchBar from "../../components/TopicSearchBar";
import UseMeiliDataContext from "../../context/MeiliContext";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField";
import OptimizedTopicSearch from "./OptimizedTopicSearch";

export default function FormStructure() {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject_tag: [],
      test_series_topic: [],
      // test_series_exams: [],
      marks: 0,
      difficulty: "Easy",
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
  console.log("watch: ", watch());
  console.log("errors: ", errors);

  // console.log('watch: ', watch());
  const onSubmitt = async (data: any) => {
    const url = `${import.meta.env.VITE_BASE_URL}t-questions`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
      },
      body: JSON.stringify({ data: data }),
    });
    const datas = await response.json();
  };
  // deleteDropItem
  const { data } = UseMeiliDataContext();

  return (
    <Box component={"form"} onSubmit={handleSubmit(onSubmitt)}>
      <Grid
        container
        spacing={3}
        sx={{ marginBlockStart: 10, paddingInline: 3, paddingBlockEnd: 5 }}
      >
        <Grid container size={12}>
          <Typography variant="h4">Question Form</Typography>
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
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Marks
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
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Select Option Type Of Question
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
          <SimpleSelectField
            label=""
            name="option_type"
            control={control}
            // label="Test Series Topic"
            options={optionTypeData}
            rules={{ required: "Please select a Topic" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          {/* <SimpleSelectField /> */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            OptionType
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
        <Grid size={12} sx={{ textAlign: "center", paddingBlock: 2 }}>
          <Button variant="contained" type="submit" sx={{ paddingInline: 10 }}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
