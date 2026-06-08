import { z } from "zod";
import { ZodIssueCode } from "zod/v3";
import {
  ALLOWED_EXTENSIONS_TEXT,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "./components/FileUploadSection2";

const baseSchema = z.object({
  difficultyLevel: z.enum(["easy", "moderate", "hard"]),

  explanation: z.string().min(1, "Explanation is required."),

  subjectIds: z.array(z.number()).min(1, "Subject is required"),
  chapterIds: z.array(z.number()).min(1, "Subject is required"),
  subjectCategoryIds: z.array(z.number()).min(1, "Subject is required"),
  examCategoryIds: z.array(z.number()).min(1, "Subject is required"),
  topicIds: z.array(z.number()).min(1, "Subject is required"),

  input_box: z.string(),

  hint: z
    .string()
    .min(1, "Hint is required.")
    .min(19, "Hint must be at least 19 characters long."),

  question: z
    .string()
    .min(1, "Question is required.")
    .min(19, "Question must be at least 19 characters long."),

  images: z
    .array(
      z.object({
        file: z.instanceof(File).nullable().optional(),
        url: z.string().url().optional(),
        deleting: z.boolean().optional(),
      }),
    )
    .optional(),
});

const inputBoxSchema = z.object({
  optionType: z.literal("Numerical"),
  input_box: z.string().optional(),
});

const singleSelectSchema = z
  .object({
    optionType: z.literal("Single"),
    options: z
      .array(
        z.object({
          // option_label: z.string().min(1, "Option label is required"),
          name: z.string().min(1, "Option text is required"),
          isCorrect: z.boolean(),
        }),
      )
      .min(3, "Please add at least 3 options."),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.options.filter((o) => o.isCorrect).length;

    if (correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please mark exactly one option as correct.",
        path: ["options"],
      });
    }
  });

const multiSelectSchema = z
  .object({
    optionType: z.literal("Multiple"),
    options: z
      .array(
        z.object({
          // option_label: z.string().min(1, "Option label is required"),
          name: z.string().min(1, "Option text is required"),
          isCorrect: z.boolean(),
        }),
      )
      .min(3, "Please add at least 3 options."),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.options.filter((o) => o.isCorrect).length;

    if (correctCount < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please mark at least two options as correct.",
        path: ["options"],
      });
    }
  });

const conditionalSchema = z.discriminatedUnion("optionType", [
  inputBoxSchema,
  singleSelectSchema,
  multiSelectSchema,
]);

// export const QuestionSchemaType = z.infer<typeof baseSchema.and(conditionalSchema)>
// export type QuestionSchemaType = z.infer<typeof QuestionSchema>;

export const QuestionSchema = baseSchema.and(conditionalSchema);
export type QuestionSchemaType = z.infer<typeof QuestionSchema>;


export const questionSchemaCreate = z.object({
  question: z.string().min(1, "Question is required"),

  explanation: z.string().min(10, "Explanation must be at least 10 characters"),

  hint: z.string().min(1, "Hint is required"),

  optionType: z.enum(["Single", "Multiple", "Numerical"], {
    error: "Invalid option type, value must be Single, Multiple or Numerical",
  }),

  difficultyLevel: z.enum(["easy", "moderate", "hard"], {
    error: "Invalid difficulty level, value must be easy, moderate or hard",
  }),

  options: z
    .array(
      z.object({
        name: z.string().min(1, "Option name is required"),
        isCorrect: z.boolean("isCorrect must be true or false"),
      }),
    )
    .min(2, "At least 2 options are required"),

  images: z.array(
    z.object({
      imageLink: z.string().url("Image link must be a valid URL"),
    }),
  ),
  subjectIds: z.number().optional(),
  subjectCategoryIds: z.array(z.number()).optional(),
  chapterIds: z.array(z.number()).optional(),
  topicIds: z.array(z.number()).optional(),
  examCategoryIds: z.array(z.number()).optional(),
});

export type TQuestionSchemaCreate = z.infer<typeof questionSchemaCreate>;