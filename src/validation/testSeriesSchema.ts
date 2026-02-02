// TestSeriesSchema.ts
import { z } from "zod";

export const TestSeriesSchema = z.object({
  createdby: z.string(),
  updatedby: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.union([z.literal(0), z.literal(1)]),
  is_active: z.boolean(),

  test_series_subject: z
    .array(
      z
        .object({
          name: z.string().optional(),
          id: z.number().optional(),
        })
        .optional()
    )
    .optional(),
  test_series_subject_category: z
    .array(
      z
        .object({
          name: z.string().optional(),
          id: z.number().optional(),
        })
        .optional()
    )
    .optional(),
  test_series_chapter: z
    .array(
      z
        .object({
          name: z.string().optional(),
          id: z.number().optional(),
        })
        .optional()
    )
    .optional(),
  // test_series_questions: z
  //   .array(z.number())
  //   .min(1, "Select at least 1 question"),
});

export type TestSeriesSchemaType = z.infer<typeof TestSeriesSchema>;
