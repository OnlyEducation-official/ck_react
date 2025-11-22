import { useForm } from 'react-hook-form'
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionSchema } from '../addQeustion/QuestionSchema';
import FormStructure from '../addQeustion/_components/FormStructure';
import { examsSchema, ExamsSchemaType } from '../validation/testSeriesExamSchema';
import TestExamFormStructure from './_components/TestExamFormStructure';

export default function TestExamsFormEdit() {
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            title: '',
            slug: null,
            description: '',
            test_series_category: 0,
            // test_series_questions: 0,
            marking_negative: 0,
            marking_positive: 0,
            timer: 0,
            test_series_subjects: 0,
            difficulty: "Easy",
            test_series_topics: 0,
        },
        resolver: zodResolver(examsSchema),
    });


    const onSubmitt = (data: ExamsSchemaType) => {
        const response = fetch(`https://admin.onlyeducation.co.in/api/t-questions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`
            },
            body: JSON.stringify({ data: data }),
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://admin.onlyeducation.co.in/api/t-exams/${id}?populate[test_series_category][fields][0]=name&populate[test_series_subjects][fields][0]=name&populate[test_series_topics][fields][0]=name`, {
                    headers: {
                        'Content-Type': 'application/json',

                        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`
                    }
                });
                const { data } = await response.json();

                reset({
                    title: data.attributes.title,
                    slug: data.attributes.slug,
                    description: data.attributes.description,
                    test_series_category: data.attributes.test_series_category.data.id,
                    marking_negative: data.attributes.marking_negative,
                    marking_positive: data.attributes.marking_positive,
                    timer: data.attributes.timer,
                    test_series_subjects: data.id,
                    difficulty: data.attributes.difficulty,
                    test_series_topics: data.id
                });
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    // if (!id) return null;

    return (
        <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmitt)}
        >
            <TestExamFormStructure control={control} setValue={setValue} watch={watch} />
        </Box>
    )
}
