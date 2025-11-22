import { useForm } from 'react-hook-form'
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { QuestionSchema } from '../addQeustion/QuestionSchema';
import FormStructure from '../addQeustion/_components/FormStructure';

export default function QuestionPreview2() {
    const { qid } = useParams();

    const [isLoading, setIsLoading] = useState(false);

    const { control, setValue, watch, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            question_title:'',
            subject_tag: 0,
            test_series_topic: 0,
            test_series_exams: [],
            marks: 0,
            difficulty: "easy",
            explanation: "",
            option_type: "input_box",
            options: [{ option_label: "A", option: "", is_correct: false }],
        },
        resolver: zodResolver(QuestionSchema),
    });

    const onSubmitt = (data) => {
        const isEdit = Boolean(id);

        const url = isEdit
            ? `${import.meta.env.VITE_BASE_URL}t-questions/${id}`
            : `${import.meta.env.VITE_BASE_URL}t-questions`;

        const method = isEdit ? "PUT" : "POST";

        const response = fetch(`${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`
            },
            body: JSON.stringify({ data: data }),
        })

        console.log(response)
    }

    useEffect(() => {
        if (!qid) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}t-questions/${qid}?populate[subject_tag][fields][0]=name&populate[subject_tag][fields][1]=slug&populate[test_series_topic][fields][0]=name&populate[test_series_topic][fields][1]=slug&populate[options]=true&populate[test_series_exams][fields][0]=title&populate[test_series_exams][fields][1]=slug`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`
                    }
                });
                const { data } = await response.json();
                let attributes = data.attributes

                reset({
                    subject_tag: attributes?.subject_tag?.data?.id,
                    test_series_topic: attributes?.test_series_topic?.data?.id,
                    test_series_exams:attributes?.test_series_exams?.data,
                    question_title:attributes.question_title,
                    hint: attributes.hint,
                    marks: attributes.marks,
                    difficulty: attributes?.difficulty,
                    explanation: attributes?.explanation,
                    option_type: attributes?.option_type,
                    options: attributes?.options,
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
    // if (!qid) return null;

    return (
        <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmitt)}
        >
            <FormStructure control={control} setValue={setValue} watch={watch} />
        </Box>
    )
}
