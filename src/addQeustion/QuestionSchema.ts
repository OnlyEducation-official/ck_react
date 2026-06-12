import { z } from "zod";

const optionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  isCorrect: z.boolean({ error: "isCorrect must be true or false" }),
});

export const questionSchemaCreate = z
  .object({
    question: z.string().min(1, "Question is required"),

    explanation: z
      .string()
      .min(10, "Explanation must be at least 10 characters"),

    hint: z.string().min(1, "Hint is required"),

    optionType: z.enum(["Single", "Multiple", "Numerical"], {
      error: "Invalid option type, value must be Single, Multiple or Numerical",
    }),

    difficultyLevel: z.enum(["easy", "moderate", "hard"], {
      error: "Invalid difficulty level, value must be easy, moderate or hard",
    }),

    options: z.array(optionSchema).optional(),

    inputBox: z.string().trim().nullable().optional(),

    images: z
      .array(
        z.object({
          file: z.instanceof(File).nullable().optional(),
          url: z.string().url().optional(),
          deleting: z.boolean().optional(),
        })
      )
      .optional(),

    subjectIds: z.number().min(1, "Subject is required"),
    subjectCategoryIds: z
      .array(z.number())
      .min(1, "Subject Category is required"),
    chapterIds: z.array(z.number()).min(1, "Chapter is required"),
    topicIds: z.array(z.number()).min(1, "Topic is required"),
    examCategoryIds: z.array(z.number()).min(1, "Exam Category is required"),
  })
  .superRefine((data, ctx) => {
    // ─────────────────────────────────────────────
    // NUMERICAL: inputBox required, options forbidden
    // ─────────────────────────────────────────────
    if (data.optionType === "Numerical") {
      if (!data.inputBox) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["inputBox"],
          message: "Please fill input box for Numerical questions",
        });
      }

      if (data.options && data.options.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Options must be empty for Numerical questions",
        });
      }

      return;
    }

    // ─────────────────────────────────────────────
    // SINGLE / MULTIPLE: inputBox forbidden, options required
    // ─────────────────────────────────────────────
    if (data.inputBox) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inputBox"],
        message: "inputBox must be empty for non-Numerical questions",
      });
    }

    if (!data.options || data.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "At least 2 options are required",
      });
      // Skip the correctness-count check until the user has enough options
      return;
    }

    const correctCount = data.options.filter((opt) => opt.isCorrect).length;

    // Single → exactly one option marked correct
    if (data.optionType === "Single" && correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message:
          "Exactly one option must be marked as correct for Single type",
      });
    }

    // Multiple → two or more options marked correct
    if (data.optionType === "Multiple" && correctCount < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message:
          "At least two options must be marked as correct for Multiple type",
      });
    }
  });

export type TQuestionSchemaCreate = z.infer<typeof questionSchemaCreate>;

export const QuestionSchema = questionSchemaCreate;
export type QuestionSchemaType = TQuestionSchemaCreate;
