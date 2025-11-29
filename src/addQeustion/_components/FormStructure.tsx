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
import { difficultyOptions } from "./data";
import TopicSearchBar from "../../components/TopicSearchBar";
import UseMeiliDataContext from "../../context/MeiliContext";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleSelectField from "../../GlobalComponent/SimpleSelectField";
import OptimizedTopicSearch from "./OptimizedTopicSearch";

export default function FormStructure({}: // control,
// watch,
// setValue,
{
  // control: Control<QuestionSchemaType>;
  // watch: UseFormWatch<QuestionSchemaType>;
  // setValue: UseFormSetValue<QuestionSchemaType>;
}) {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject_tag: 0,
      test_series_topic: [],
      // test_series_exams: [],
      marks: 0,
      difficulty: "easy",
      hint: "",
      option_type: "single_select",
      // explanation: "",
      // options: [
      //   { option_label: "A", option: "", is_correct: false },
      //   { option_label: "B", option: "", is_correct: false },
      //   { option_label: "C", option: "", is_correct: false },
      //   { option_label: "B", option: "", is_correct: false },
      // ],
    },
    resolver: zodResolver(QuestionSchema),
    // resolver: zodResolver(QuestionSchema),
  });
  console.log("watch: ", watch());

  // console.log('watch: ', watch());
  const onSubmitt = async (data: any) => {
    const response = await fetch(
      "https://admin.onlyeducation.co.in/api/t-questions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`,
        },
        body: JSON.stringify({ data: data }),
      }
    );
    const datas = await response.json();
  };
  // deleteDropItem
  const { data } = UseMeiliDataContext();
  // console.log("data: ", data);

  // const deleteData = (id: number, type: any) => {
  //   deleteDropItem(id, type);
  // };
  // console.log('watch: ', watch());

  // const topics = data.topicData || [];
  // const subjects = data.subjectData || [];
  // console.log("data.subjectData: ", data?.subjectData?.[0]?.id);
  // setValue("subject_tag", data?.subjectData?.[0]?.id || 0);
  // const subjectOptions = subjects
  //   .filter((s) => typeof s.id === "number") // keep only items with id
  //   .map((s) => ({
  //     value: s.id as number,
  //     label: s.title || s.name || s.slug || "",
  //   }));

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
        {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
      </Grid> */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          subject async
          <OptimizedTopicSearch
            routeName="test-series-subject"
            dropdownType="single"
            fieldName="subject_tag"
            setValue={setValue}
            watch={watch}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          topic async
          <OptimizedTopicSearch
            routeName="t-topic"
            dropdownType="multi"
            fieldName="test_series_topic"
            setValue={setValue}
            watch={watch}
          />
        </Grid>

        <Grid>
          <TopicSearchBar
            setValue={setValue}
            watch={watch}
            fieldName="subject_tag"
            routeName="test-series-subject"
            typeName="subjectData"
            dropdownType="single"
          />
        </Grid>

        <Grid>
          <TopicSearchBar
            setValue={setValue}
            watch={watch}
            fieldName="test_series_topic"
            routeName="t-topic"
            typeName="topicData"
            dropdownType="multi"
          />
          {/* <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 700 }}
            >
              Selected topics
            </Typography>

            {watch("test_series_topic").length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No topics added yet. Start searching and selecting from the
                dropdown.
              </Typography>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  maxHeight: 240,
                  overflowY: "auto",
                }}
              >
                <List dense disablePadding>
                  {watch("test_series_topic").map((d, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          // onClick={() => deleteData(d.id as number, "topicData")}
                          onClick={() =>
                            setValue(
                              "test_series_topic",
                              watch("test_series_topic").filter(
                                (item: number) => item !== d
                              )
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          d
                          // d.title || d.name || d.slug || "Untitled topic"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box> */}
        </Grid>
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
          <Typography variant="subtitle1">Hint</Typography>
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
