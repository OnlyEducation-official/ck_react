import { Box, Button, Grid, Typography } from '@mui/material'
import SimpleSelectField, { Option } from '../../GlobalComponent/SimpleSelectField'
import { Control, useFieldArray, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { QuestionSchemaType } from '../QuestionSchema'
import SimpleTextField from '../../GlobalComponent/SimpleTextField'
import MainEditor from '../components/MainEditor'
import OptionsFieldArray from '../components/OptionsFieldArray'
import { difficultyOptions, dummySubject, dummyTopics } from './data'
import { useContext } from 'react'
import useInitialDataContext from './InitalContext'

export default function FormStructure({
    control,
    watch,
    setValue
}: {
    control: Control<QuestionSchemaType>;
    watch: UseFormWatch<QuestionSchemaType>;
    setValue: UseFormSetValue<QuestionSchemaType>
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });
    const { subjectTagData, topicTagData } = useInitialDataContext();

    return (
        <Grid
            container
            spacing={3}
            sx={{ marginBlockStart: 10, paddingInline: 3 }}
        >
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                    Select subject
                </Typography>
                <SimpleSelectField
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
            <Grid size={{ xs: 12, md: 6 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Test series topic
                </Typography>
                <SimpleSelectField
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
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Marks
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
            <Grid size={{ xs: 12, md: 6 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Difficulty
                </Typography>
                <SimpleSelectField
                    name="difficulty"
                    control={control}
                    // label="Test Series Topic"
                    options={difficultyOptions}
                    rules={{ required: "Please select a Topic" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                    Question Title
                </Typography>
                <MainEditor
                    name="question_title"
                    value={watch("question_title")}
                    setValue={setValue}
                    watch={watch}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                    Explaination
                </Typography>
                <MainEditor
                    name="explanation"
                    value={watch("explanation")}
                    setValue={setValue}
                    watch={watch}
                />
            </Grid>
            <Grid size={12}>
                <OptionsFieldArray
                    watch={watch}
                    control={control}
                    setValue={setValue}
                />
            </Grid>
            <Button variant="contained" type="submit">
                Submit
            </Button>
        </Grid>
    )
}
