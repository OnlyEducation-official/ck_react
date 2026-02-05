import { z } from "zod";

export const examsSchema = z.object({
  createdby: z.string(),
  updatedby: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().nullable().optional(),
  description: z.string().min(1, "Title is required"),
  test_series_category: z.number().nullable().optional(),
  // test_series_questions: z.number().nullable().optional(),
  marking_negative: z
    .number({
      error: "Please enter a valid number",
    })
    .min(0, "Value must be greater or equals to 0."),
  marking_positive: z
    .number({
      error: "Please enter a valid number",
    })
    .min(1, "Value must be greater than 0."),
  timer: z
    .number({
      error: "Please enter a valid number",
    })
    .min(1, "Value must be greater than 0."),
  test_series_subjects: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().optional(),
    }).optional()
  ).optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    error: "Please select difficulty",
  }),
  test_series_topics: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().optional(),
    }).optional()
  ).optional()
});
export type ExamsSchemaType = z.infer<typeof examsSchema>;
