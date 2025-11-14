// TestSeriesSchema.ts
import { z } from "zod";

export const TestSeriesSchema = z.object({
  name: z.string().min(1, "Name is required"),
    // slug: z.string().min(1, "Slug is required"),
  order: z.number().optional(),
  is_active: z.boolean(),

  test_series_subject: z.number().min(1, "Select at least 1 subject"),
    // test_series_questions: z
    //   .array(z.number())
    //   .min(1, "Select at least 1 question"),
});

export type TestSeriesSchemaType = z.infer<typeof TestSeriesSchema>;
