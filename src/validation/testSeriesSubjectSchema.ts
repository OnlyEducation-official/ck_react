import { z } from "zod";

export const TestSchema = z.object({
  createdby: z.string(),
  updatedby: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().nullable().optional(),
  order: z.number().nullable().optional(),
  // test_series_exams: z.number().nullable().optional(),  
  isActive: z.boolean(),

  //   icon: z
  //     .any()
  //     .refine((file) => file instanceof File, "Please upload an image")
  //     .refine((file) => file?.size <= 2 * 1024 * 1024, "Max 2MB allowed")
  //     .refine(
  //       (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file?.type),
  //       "Only PNG, JPG, JPEG allowed"
  //     ),
});

export type TestSchemaType = z.infer<typeof TestSchema>;
