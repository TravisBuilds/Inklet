import type { StoryMeta } from "../types";

/**
 * Returns a similarity score between two stories.
 * Higher = more similar.
 */
export function storySimilarity(a: StoryMeta, b: StoryMeta): number {
  let score = 0;

  // Same franchise = heavy weight
  if (a.franchise === b.franchise) score += 50;

  // Mood overlap
  const moodsA = new Set(a.moodCategories || []);
  const moodsB = new Set(b.moodCategories || []);
  const moodOverlap = [...moodsA].filter((m) => moodsB.has(m)).length;
  score += moodOverlap * 8;

  // Tag overlap
  const tagsA = new Set(a.tags || []);
  const tagsB = new Set(b.tags || []);
  const tagOverlap = [...tagsA].filter((t) => tagsB.has(t)).length;
  score += tagOverlap * 6;

  // Length similarity
  if (a.length === b.length) score += 4;

  // Adult content match
  if (a.is_adult === b.is_adult) score += 3;

  // More recent stories are preferred
  const timeDelta =
    Math.abs(new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);
  score += Math.max(0, 8 - Math.min(timeDelta / 30, 8)); // more recent better

  return score;
}
