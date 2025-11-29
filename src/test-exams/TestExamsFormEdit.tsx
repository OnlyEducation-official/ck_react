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

    return (
        // <Box
        //     component={"form"}
        //     onSubmit={handleSubmit(onSubmitt)}
        // >
            <TestExamFormStructure />
        // </Box>
    )
}
