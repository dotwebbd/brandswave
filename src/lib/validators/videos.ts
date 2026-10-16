import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150),
  youtubeUrl: z.string().trim().min(1, "YouTube URL or ID is required"),
  category: z.enum(["TVC", "COMMERCIAL", "FASHION_SHOOT", "SOCIAL_MEDIA", "OTHER"]),
  orientation: z.enum(["LANDSCAPE_16_9", "VERTICAL_9_16"]),
  isFeatured: z.boolean().default(false),
  thumbnailImageId: z.string().trim().nullable().optional(),
});

export type VideoFormData = z.infer<typeof videoSchema>;
