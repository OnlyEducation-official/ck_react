import { z } from "zod";
import { ZodIssueCode } from "zod/v3";
import {
  ALLOWED_EXTENSIONS_TEXT,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "./components/FileUploadSection2";

// export const QuestionSchema = z
//   .object({
//     // question_title: z.string().min(1, "Question title is required"),
//     createdby: z.string(),
//     updatedby: z.string(),
//     createdAt: z.string(),
//     updatedAt: z.string(),
//     difficulty: z.enum(["easy", "medium", "hard"]),
//     input_box: z.string().min(1, "Please enter answer.").optional(),
//     explanation: z
//       .string()
//       .min(1, "Explanation is required.")
//       .min(1, "Explanation must be at least 1 characters long."),
//     option_type: z.enum(["single_select", "multi_select", "input_box"]),
//     subject_tag: z
//       .array(z.object({ id: z.number(), name: z.string() }))
//       .min(1, "Subject is required"),
//     hint: z
//       .string()
//       .min(1, "Hint is required.")
//       .min(19, "Hint must be at least 1 characters long."),
//     test_series_exams: z
//       .array(z.object({ id: z.number(), title: z.string() }))
//       .min(1, "At least one test series exam is required"),
//     // test_series_topic: z.number().min(1, "Topic is required"),
//     test_series_topic: z
//       .array(z.object({ id: z.number(), name: z.string() }))
//       .min(1, "Atleast 1 topic is required"),
//     test_series_chapters: z
//       .array(z.object({ id: z.number(), name: z.string() }))
//       .min(1, "Atleast 1 Chapter is required"),
//     test_series_subject_category: z
//       .array(z.object({ id: z.number(), name: z.string() }))
//       .min(1, "Atleast 1 subject Category is required"),
//     options: z
//       .array(
//         z.object({
//           option_label: z.string().min(1, "Option label is required").optional(),
//           option: z.string().min(1, "Option text is required").optional(),
//           is_correct: z.boolean(),
//         })
//       )
//       .optional(),
//     question_title: z
//       .string()
//       .min(1, "Question is required.")
//       .min(19, "Question must be at least 1 characters long."),
//     question_image: z
//       .array(
//         z
//           .object({
//             file: z
//               .instanceof(File, { message: "Image is required" })
//               .refine(
//                 (file) => ALLOWED_IMAGE_TYPES.includes(file.type as any),
//                 {
//                   message: `Only ${ALLOWED_EXTENSIONS_TEXT} files are allowed`,
//                 },
//               )
//               .refine((file) => file.size <= MAX_IMAGE_SIZE, {
//                 message: "Image must be smaller than 5MB",
//               })
//               .nullable()
//               .optional(),
//             url: z.string().url().optional(),
//             deleting: z.boolean().optional(),
//           })
//           .refine((data) => data.url || data.file, {
//             message: "Image is required",
//             path: ["file"],
//           })
//           .optional(),
//       )
//       .optional(),
//   })
//   .superRefine((fieldName, ctx) => {
//     const { option_type, options = [], input_box } = fieldName;

//     // 🟢 INPUT BOX TYPE
//     if (option_type === "input_box") {
//       if (!input_box || input_box.trim() === "") {
//         ctx.addIssue({
//           code: ZodIssueCode.custom,
//           message: "Please enter answer.",
//           path: ["input_box"],
//         });
//       }

//       return; // stop further option validation
//     }

//     // 🟢 SELECT TYPES (single & multi)
//     if (!options || options.length < 3) {
//       ctx.addIssue({
//         code: ZodIssueCode.custom,
//         message: "Please add at least 3 options.",
//         path: ["options"],
//       });
//       return;
//     }

//     const correctOptions = options.filter(o => o.is_correct);

//     // SINGLE SELECT
//     if (option_type === "single_select") {
//       if (correctOptions.length !== 1) {
//         ctx.addIssue({
//           code: ZodIssueCode.custom,
//           message: "Please mark exactly one option as correct.",
//           path: ["options"],
//         });
//       }
//     }

//     // MULTI SELECT
//     if (option_type === "multi_select") {
//       if (correctOptions.length < 2) {
//         ctx.addIssue({
//           code: ZodIssueCode.custom,
//           message: "Please mark at least two options as correct.",
//           path: ["options"],
//         });
//       }
//     }

//   });

//   const inputBoxSchema = z.object({
//   option_type: z.literal("input_box"),
//   input_box: z.string().min(1, "Please enter answer."),
// });

// const singleSelectSchema = z.object({
//   option_type: z.literal("single_select"),
//   options: z
//     .array(
//       z.object({
//         option_label: z.string().min(1, "Option label is required"),
//         option: z.string().min(1, "Option text is required"),
//         is_correct: z.boolean(),
//       })
//     )
//     .min(3, "Please add at least 3 options."),
// }).superRefine((data, ctx) => {
//   const correctCount = data.options.filter(o => o.is_correct).length;

//   if (correctCount !== 1) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Please mark exactly one option as correct.",
//       path: ["options"],
//     });
//   }
// });

// const multiSelectSchema = z.object({
//   option_type: z.literal("multi_select"),
//   options: z
//     .array(
//       z.object({
//         option_label: z.string().min(1, "Option label is required"),
//         option: z.string().min(1, "Option text is required"),
//         is_correct: z.boolean(),
//       })
//     )
//     .min(3, "Please add at least 3 options."),
// }).superRefine((data, ctx) => {
//   const correctCount = data.options.filter(o => o.is_correct).length;

//   if (correctCount < 2) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "Please mark at least two options as correct.",
//       path: ["options"],
//     });
//   }
// });

// const conditionalSchema = z.discriminatedUnion("option_type", [
//   inputBoxSchema,
//   singleSelectSchema,
//   multiSelectSchema,
// ]);



// export type QuestionSchemaType = z.infer<typeof QuestionSchema>;

const baseSchema = z.object({
  createdby: z.string(),
  updatedby: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  difficulty: z.enum(["easy", "medium", "hard"]),

  explanation: z
    .string()
    .min(1, "Explanation is required."),

  test_series_subject: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .min(1, "Subject is required"),

  input_box: z.string(),

  hint: z
    .string()
    .min(1, "Hint is required.")
    .min(19, "Hint must be at least 19 characters long."),

  test_series_exams: z
    .array(z.object({ id: z.number(), title: z.string() }))
    .min(1, "At least one test series exam is required"),

  test_series_topics: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .min(1, "At least 1 topic is required"),

  test_series_chapters: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .min(1, "At least 1 Chapter is required"),

  test_series_subject_category: z
    .array(z.object({ id: z.number(), name: z.string() }))
    .min(1, "At least 1 subject Category is required"),

  question_title: z
    .string()
    .min(1, "Question is required.")
    .min(19, "Question must be at least 19 characters long."),

  question_image: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .nullable()
          .optional(),
        url: z.string().url().optional(),
        deleting: z.boolean().optional(),
      })
    )
    .optional(),
});

const inputBoxSchema = z.object({
  option_type: z.literal("input_box"),
  input_box: z.string().min(1, "Please enter answer."),
});

const singleSelectSchema = z.object({
  option_type: z.literal("single_select"),
  options: z
    .array(
      z.object({
        option_label: z.string().min(1, "Option label is required"),
        option: z.string().min(1, "Option text is required"),
        is_correct: z.boolean(),
      })
    )
    .min(3, "Please add at least 3 options."),
}).superRefine((data, ctx) => {
  const correctCount = data.options.filter(o => o.is_correct).length;

  if (correctCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please mark exactly one option as correct.",
      path: ["options"],
    });
  }
});

const multiSelectSchema = z.object({
  option_type: z.literal("multi_select"),
  options: z
    .array(
      z.object({
        option_label: z.string().min(1, "Option label is required"),
        option: z.string().min(1, "Option text is required"),
        is_correct: z.boolean(),
      })
    )
    .min(3, "Please add at least 3 options."),
}).superRefine((data, ctx) => {
  const correctCount = data.options.filter(o => o.is_correct).length;

  if (correctCount < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please mark at least two options as correct.",
      path: ["options"],
    });
  }
});


const conditionalSchema = z.discriminatedUnion("option_type", [
  inputBoxSchema,
  singleSelectSchema,
  multiSelectSchema,
]);

// export const QuestionSchemaType = z.infer<typeof baseSchema.and(conditionalSchema)>
// export type QuestionSchemaType = z.infer<typeof QuestionSchema>;

export const QuestionSchema = baseSchema.and(conditionalSchema);
export type QuestionSchemaType = z.infer<typeof QuestionSchema>;




