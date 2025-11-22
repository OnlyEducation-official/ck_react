import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import TestExamFormStructure from "./_components/TestExamFormStructure";
import { QuestionSchema } from "../addQeustion/QuestionSchema";
import { examsSchema } from "../validation/testSeriesExamSchema";
import { zodResolver } from "@hookform/resolvers/zod";


export default function TestExamsForm() {
    const {
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
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
            test_series_subjects: [],
            difficulty: "Easy",
            test_series_topics: [],
        },
        resolver: zodResolver(examsSchema),
    });

    const onSubmitt = async (data: any) => {
        const response = await fetch(
            "https://admin.onlyeducation.co.in/api/t-exams",
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
        <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmitt)}
        >
            <TestExamFormStructure control={control} setValue={setValue} watch={watch} />
        </Box>
    );
}
