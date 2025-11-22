// src/types.ts

export interface StoryMeta {
  id: string;
  title: string;

  franchise: string;           // e.g. "Jujutsu Kaisen"
  category?: string | null;    // optional broad grouping like "anime", "tv", etc.

  is_adult: boolean;
  length: "short" | "medium" | "long";

  tags: string[];              // character tags + franchise name
  moodCategories: string[];    // emotional mood tags

  synopsis: string;
  upvotes: number;

  createdAt: string;
}

export interface StoryDetail extends StoryMeta {
  content: string;
}

export interface Comment {
  id: string;
  storyId: string;
  userName: string;
  content: string;
  createdAt: string;
}
