import { z } from "zod";
export const CarSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  image_url: z.string().url().optional(),
});
export type CarInput = z.infer<typeof CarSchema>;
