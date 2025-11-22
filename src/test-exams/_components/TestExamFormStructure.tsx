import { Box, Button, Grid, Typography } from '@mui/material'
import SimpleSelectField, { Option } from '../../GlobalComponent/SimpleSelectField'
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import SimpleTextField from '../../GlobalComponent/SimpleTextField'
import { QuestionSchemaType } from '../../addQeustion/QuestionSchema'
import useInitialDataContext from '../../addQeustion/_components/InitalContext'
import { difficultyOptions, optionTypeData } from '../../addQeustion/_components/data'
import MainEditor from '../../addQeustion/components/MainEditor'
import { ExamsSchemaType } from '../../validation/testSeriesExamSchema'
import { useEffect } from 'react'
import { slugify } from '../../testSubject/components/TestSubjectForm'
import SimpleMultiAutoComplete from '../../GlobalComponent/SimpleMultiAutoComplete'

export default function TestExamFormStructure({
    control,
    watch,
    setValue
}: {
    control: Control<ExamsSchemaType>;
    watch: UseFormWatch<ExamsSchemaType>;
    setValue: UseFormSetValue<ExamsSchemaType>
}) {
    const { data: { examCategoryData, subjectTagData, topicTagData, tExamsData }, setSubject } = useInitialDataContext();
    console.log('topicTagData: ', topicTagData);
    useEffect(() => {
        if (!watch('title')) return;
        setValue("slug", slugify(watch('title')));
    }, [watch('title'), setValue]);
    // useEffect(() => {
    //     setSubject(watch('test_series_subjects'));
    // }, [watch('test_series_subjects')]);

    return (
        <Grid
            container
            spacing={3}
            sx={{ marginBlockStart: 10, paddingInline: 3, paddingBlockEnd: 5 }}
        >
            <Grid container size={12}>
                <Typography variant="h4">
                    Exam Form
                </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Title
                </Typography>
                <SimpleTextField
                    name="title"
                    control={control}
                    // label="Test Series Topic"
                    // options={difficultyOptions}
                    rules={{ required: "Enter title" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Typography variant="subtitle1">
                    Slug
                </Typography>
                <SimpleTextField
                    name="slug"
                    control={control}
                    rules={{ required: "Slug is required" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Description
                </Typography>
                <SimpleTextField
                    name="description"
                    control={control}
                    // label="Test Series Topic"
                    // options={difficultyOptions}
                    rules={{ required: "Enter description" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Typography variant="subtitle1">
                    Test Series Category
                </Typography>
                <SimpleSelectField
                    name="test_series_category"
                    control={control}
                    // label="Select Subject"
                    options={
                        examCategoryData?.map((subject) => ({
                            value: subject.id,
                            label: subject.attributes.name,
                        })) as Option[]
                    }
                    rules={{ required: "Please select a subject" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Marking Negative
                </Typography>
                <SimpleTextField
                    name="marking_negative"
                    control={control}
                    type='number'
                    // label="Test Series Topic"
                    // options={difficultyOptions}
                    rules={{ required: "Please select a Topic" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Marking Positive
                </Typography>
                <SimpleTextField
                    name="marking_positive"
                    control={control}
                    type='number'
                    // label="Test Series Topic"
                    // options={difficultyOptions}
                    rules={{ required: "Please select a Topic" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Typography variant="subtitle1">
                    {`Timer (seconds)`}
                </Typography>
                <SimpleTextField
                    name="timer"
                    control={control}
                    // label="Select Subject"
                    rules={{ required: "Please select a subject" }}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                <Typography variant="subtitle1">
                    Select subject
                </Typography>
                <SimpleMultiAutoComplete
                    control={control}
                    name='test_series_subjects'
                    options={
                        subjectTagData?.map((subject) => ({
                            value: subject.id,
                            label: subject.attributes.name,
                        })) as Option[]
                    }
                />
                {/* <SimpleSelectField
                    name="test_series_subjects"
                    control={control}
                    // label="Select Subject"
                    options={
                        subjectTagData?.map((subject) => ({
                            value: subject.id,
                            label: subject.attributes.name,
                        })) as Option[]
                    }
                    rules={{ required: "Please select a subject" }}
                /> */}
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                {/* <SimpleSelectField /> */}
                <Typography variant="subtitle1">
                    Select topic
                </Typography>
                <SimpleMultiAutoComplete
                    name="test_series_topics"
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
            <Grid size={12} sx={{ textAlign: 'center', paddingBlock: 2 }}>
                <Button variant="contained" type="submit" sx={{ paddingInline: 10 }}>
                    Submit
                </Button>
            </Grid>
        </Grid>
    )
}
