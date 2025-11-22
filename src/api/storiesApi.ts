// src/api/storiesApi.ts
import type { StoryMeta, StoryDetail, Comment } from "../types";
import { supabase } from "../lib/supabaseClient";

function mapStoryRow(row: any): StoryMeta {
  return {
    id: String(row.id),
    title: row.title,

    franchise: row.franchise,
    category: row.category,

    is_adult: row.is_adult,
    length: row.length,

    tags: row.tags ?? [],
    moodCategories: row.mood_categories ?? [],

    synopsis: row.synopsis ?? "",
    upvotes: row.upvotes ?? 0,

    createdAt: row.created_at
  };
}

export async function fetchStories(): Promise<StoryMeta[]> {
  const { data, error } = await supabase
    .from("stories")
    .select(
      "id, title, franchise, category, is_adult, length, tags, mood_categories, synopsis, created_at, upvotes"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching stories:", error);
    return [];
  }

  return (data ?? []).map(mapStoryRow);
}

export async function fetchStoryById(id: string): Promise<StoryDetail | null> {
  const { data, error } = await supabase
    .from("stories")
    .select(
      "id, title, franchise, category, is_adult, length, tags, mood_categories, synopsis, content, created_at, upvotes"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching story by id:", error);
    return null;
  }
  if (!data) return null;

  const meta = mapStoryRow(data);
  return {
    ...meta,
    content: data.content ?? ""
  };
}

export async function fetchComments(storyId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, story_id, user_name, content, created_at")
    .eq("story_id", storyId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    storyId: row.story_id,
    userName: row.user_name ?? "anon",
    content: row.content,
    createdAt: row.created_at
  }));
}

export async function postComment(
  storyId: string,
  userName: string,
  content: string
): Promise<Comment | null> {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      story_id: storyId,
      user_name: userName,
      content
    })
    .select("id, story_id, user_name, content, created_at")
    .maybeSingle();

  if (error) {
    console.error("Error posting comment:", error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    storyId: data.story_id,
    userName: data.user_name ?? "anon",
    content: data.content,
    createdAt: data.created_at
  };
}

export async function upvoteStory(id: string): Promise<void> {
  // TODO: wire into story_upvotes table + increment on server
  console.log("upvoteStory not yet implemented, story id:", id);
}
