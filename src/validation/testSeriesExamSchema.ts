import { z } from "zod";

export const examsSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().nullable().optional(),
    description: z.string().min(1, "Title is required"),
    test_series_category: z.number().nullable().optional(),
    // test_series_questions: z.number().nullable().optional(),
    marking_negative: z.number().max(0, "Must be zero or negative"),
    marking_positive: z.number().min(0, "Must be zero or positive"),
    timer: z.number().optional(),
    test_series_subjects: z.number().min(1, "Subject tag ID is required"),
    difficulty: z.enum(["Easy", "Medium", "Hard"], { error: "Select difficulty" }),
    test_series_topics: z.number().nullable().optional(),
});
export type ExamsSchemaType = z.infer<typeof examsSchema>;
