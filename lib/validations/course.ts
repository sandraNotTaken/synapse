import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, "Course title must be at least 3 characters")
    .max(100, "Course title cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  color: z.string(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;