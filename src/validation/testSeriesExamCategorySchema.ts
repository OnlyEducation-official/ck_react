import { z } from "zod";

export const TestExamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  total_marks: z.number().min(50, "Total marks must be greater than 50."),
  order: z.number().nullable().optional(),
  is_active: z.boolean(),
  createdby: z.string(),
  updatedby: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TestSeriesExamType = z.infer<typeof TestExamSchema>;
