export const IMAGE_LIMITS = {
  maxInputBytes: 8 * 1024 * 1024, // raw upload ceiling
  maxOutputBytes: 5 * 1024 * 1024, // after compression
  maxWidth: 1600,
  webpQuality: 80,
  allowedMime: ["image/jpeg", "image/png", "image/webp"] as const,
};
