// TestSeriesSchema.ts
import { z } from "zod";

export const TestSeriesSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type TestSeriesSchemaType = z.infer<typeof TestSeriesSchema>;
