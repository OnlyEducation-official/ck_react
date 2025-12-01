import { z } from "zod";

export const QuestionSchema = z.object({
  // question_title: z.string().min(1, "Question title is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  explanation: z.string().min(5, "Explanation must be at least 5 characters"),
  option_type: z.enum(["single_select", "multi_select", "input_box"]),
  subject_tag: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .min(1, "Subject is required"),
  hint: z.string().optional(),
  test_series_exams: z
    .array(z.object({ id: z.number(), title: z.string() }))
    .min(1, "At least one test series exam is required"),
  // test_series_topic: z.number().min(1, "Topic is required"),
  test_series_topic: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .min(1, "Atleast 1 topic is required"),
  options: z
    .array(
      z.object({
        option_label: z.string().min(1, "Option label is required"),
        option: z.string().min(1, "Option text is required"),
        is_correct: z.boolean(),
      })
    )
    .min(1, "At least two options are required")
    .refine(
      (opts) => opts.some((o) => o.is_correct === true),
      "At least one option must be marked correct"
    ),
  question_title: z.string().min(1, "Question content is required"),
});
export type QuestionSchemaType = z.infer<typeof QuestionSchema>;
