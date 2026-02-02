import { z } from "zod";
import { ZodIssueCode } from "zod/v3";

export const QuestionSchema = z
  .object({
    // question_title: z.string().min(1, "Question title is required"),
    createdby:z.string(),
    updatedby:z.string(),
    createdAt:z.string(),
    updatedAt:z.string(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    explanation: z.string()
      .min(1, "Explanation is required.")
      .min(17, "Explanation must be at least 10 characters long."),
    option_type: z.enum(["single_select", "multi_select", "input_box"]),
    subject_tag: z
      .array(z.object({ id: z.number(), name: z.string() }))
      .min(1, "Subject is required"),
    hint: z.string()
      .min(1, "Hint is required.")
      .min(19, "Hint must be at least 10 characters long."),
    test_series_exams: z
      .array(z.object({ id: z.number(), title: z.string() }))
      .min(1, "At least one test series exam is required"),
    // test_series_topic: z.number().min(1, "Topic is required"),
    test_series_topic: z
      .array(z.object({ id: z.number(), name: z.string() }))
      .min(1, "Atleast 1 topic is required"),
    test_series_chapters: z
      .array(z.object({ id: z.number(), name: z.string() }))
      .min(1, "Atleast 1 Chapter is required"),
    test_series_subject_category: z
      .array(z.object({ id: z.number(), name: z.string() }))
      .min(1, "Atleast 1 subject Category is required"),
    options: z.array(
      z.object({
        option_label: z.string().min(1, "Option label is required"),
        option: z.string().min(1, "Option text is required"),
        is_correct: z.boolean(),
      })
    ),
    question_title: z.string()
      .min(1, "Question is required.")
      .min(19, "Question must be at least 10 characters long."),
  })
  .superRefine((fieldName, ctx) => {
    const options = fieldName.options;
    const optiionType = fieldName.option_type;
    if (options.length < 3) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Please add at least 3 options.",
        path: ["options"],
      });
    }

    const hasCorrect = options.some((o) => o.is_correct === true);
    if (!hasCorrect) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Please mark at least one option as correct.",
        path: ["options"],
      });
    }

    const checkOptionAsPerOptionType = options.filter((o) => o.is_correct === true);
    if (optiionType === "single_select" && checkOptionAsPerOptionType.length > 1) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Please mark at least one option as correct.",
        path: ["options"],
      });
    } else if (optiionType === "multi_select" && checkOptionAsPerOptionType.length <= 1) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: "Please mark at least two or more options as correct.",
        path: ["options"],
      });
    }

  });
export type QuestionSchemaType = z.infer<typeof QuestionSchema>;
