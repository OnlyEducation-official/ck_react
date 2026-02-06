// userForm.schema.ts
import { z } from "zod";
import { isValidNumber } from "libphonenumber-js";
import { parse, isValid, isAfter, differenceInYears } from "date-fns";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DATE_FORMAT = "dd/MM/yyyy";

export const profileFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  surname: z.string().min(2, "Surname is required"),
  dob: z
  .string()
  .optional()
  .superRefine((value, ctx) => {
    if (!value || !value.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date of Birth is required",
      });
      return;
    }

    const parsed = parse(value, DATE_FORMAT, new Date());

    if (!isValid(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid date format (DD/MM/YYYY)",
      });
      return;
    }

    if (isAfter(parsed, new Date())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date of Birth cannot be in the future",
      });
      return;
    }

    if (differenceInYears(new Date(), parsed) < 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must be at least 18 years old",
      });
    }
  }),

  gender: z
    .string()
    .refine((val) => ["Male", "Memale", "Other"].includes(val), {
      message: "Gender is required",
    }),
  bio: z.string().min(2 , "Bio must be at least 10 characters"),

  contact: z.string().refine(
    (value) => {
      const normalized = value.replace(/^(\+91|\s)/g, "");
      return isValidNumber(normalized, "IN");
    },
    {
      message: "Invalid phone number",
    },
  ),

  email: z.string().email("Invalid email address"),

  // aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),

  // pan: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, "Invalid PAN number"),
  photo: z
    .instanceof(File, { message: "Photo is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max 5MB allowed")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG/PNG/WebP allowed",
    ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
