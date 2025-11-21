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
    console.log('watch: ', watch());


    const onSubmitt = (data: ExamsSchemaType) => {
        console.log('submit', data);
        const response = fetch(`https://admin.onlyeducation.co.in/api/t-questions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 396dcb5c356426f8c3ce8303bcdc6feb5ecb1fd4aa4aaa59e42e1c7f82b6385cf4107d023cc58cfd61294adb023993a8e58e0aad8759fbf44fc020c1ac02f492c9d42d1f7dc12fc05c8144fbe80f06850c79d4b823241c83c5e153b03d1f8d0316fb9dec1a531c0df061e1f242bab549f17f715b900ba9546f6a6351fdd7dfa8'
            },
            body: JSON.stringify({ data: data }),
        })
        console.log('response', response);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://admin.onlyeducation.co.in/api/t-exams/${id}?populate[test_series_category][fields][0]=name&populate[test_series_subjects][fields][0]=name&populate[test_series_topics][fields][0]=name`, {
                    headers: {
                        'Content-Type': 'application/json',

                        'Authorization': `Bearer 396dcb5c356426f8c3ce8303bcdc6feb5ecb1fd4aa4aaa59e42e1c7f82b6385cf4107d023cc58cfd61294adb023993a8e58e0aad8759fbf44fc020c1ac02f492c9d42d1f7dc12fc05c8144fbe80f06850c79d4b823241c83c5e153b03d1f8d0316fb9dec1a531c0df061e1f242bab549f17f715b900ba9546f6a6351fdd7dfa8`
                    }
                });
                // console.log('response: ', await response.json());
                const { data } = await response.json();
                console.log('data12: ', data);

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
