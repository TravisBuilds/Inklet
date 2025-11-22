// src/utils/storyLength.ts
export type StoryLength = "short" | "medium" | "long";

export function inferLengthFromContent(content: string): StoryLength {
  const words = content.split(/\s+/).filter(Boolean).length;

  if (words < 2500) return "short";
  if (words < 4500) return "medium";
  return "long";
}
