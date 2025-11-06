import { z } from "zod";

export const QuestionSchema = z.object({
    question: z
        .string()
        .min(1, "Question text is required"),
    options: z
        .array(z.string().min(1, "Option cannot be empty"))
        .min(2, "At least two options are required"),
    answer: z
        .string()
        .min(1, "Answer is required"),
});

// ✅ Infer TypeScript type
export type QuestionType = z.infer<typeof QuestionSchema>;
