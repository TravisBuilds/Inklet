// scripts/importStories.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.import" });

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const STORIES_DIR = process.env.STORIES_DIR || "stories";
const DRY_RUN = process.env.DRY_RUN === "true";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Simple word-count based length
function inferLength(content: string): "short" | "medium" | "long" {
  const words = content.split(/\s+/).filter(Boolean).length;
  if (words < 2500) return "short";
  if (words < 4500) return "medium";
  return "long";
}

interface ParsedStory {
  filename: string;
  isAdult: boolean;
  title: string;
  franchise: string;
  characterTags: string[];
  moodCategories: string[];
  synopsis: string;
  content: string;
  length: "short" | "medium" | "long";
  tags: string[];
}

/**
 * Parses a story file with header format:
 *
 * IS_ADULT: true/false
 * TITLE: ...
 * FRANCHISE: ...
 * CHARACTER_TAGS: name1, name2, ...
 * MOOD_CATEGORIES: mood1, mood2
 * SYNOPSIS:
 * <one or more lines>
 *
 * STORY:
 * <full story body>
 */
function parseStoryFile(filePath: string): ParsedStory {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);

  const getLineValue = (prefix: string): string => {
    const line = lines.find((l) => l.startsWith(prefix));
    if (!line) return "";
    return line.slice(prefix.length).trim();
  };

  const isAdultLine = getLineValue("IS_ADULT:");
  const title = getLineValue("TITLE:");
  const franchise = getLineValue("FRANCHISE:");
  const characterTagsLine = getLineValue("CHARACTER_TAGS:");
  const moodCategoriesLine = getLineValue("MOOD_CATEGORIES:");

  const isAdult = isAdultLine.toLowerCase().includes("true");
  const characterTags = characterTagsLine
    ? characterTagsLine.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const moodCategories = moodCategoriesLine
    ? moodCategoriesLine.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Grab SYNOPSIS block between "SYNOPSIS:" and "STORY:"
  const synopsisIndex = lines.findIndex((l) => l.trim() === "SYNOPSIS:");
  const storyIndex = lines.findIndex((l) => l.trim() === "STORY:");

  if (synopsisIndex === -1 || storyIndex === -1 || storyIndex <= synopsisIndex) {
    throw new Error("Invalid format: missing SYNOPSIS/STORY block");
  }

  const synopsisLines = lines.slice(synopsisIndex + 1, storyIndex);
  const synopsis = synopsisLines.join("\n").trim();

  const storyLines = lines.slice(storyIndex + 1);
  const content = storyLines.join("\n").trim();

  const length = inferLength(content);

  // Tags = character tags + franchise term for search
  const tags = [...new Set([...characterTags, franchise].filter(Boolean))];

  return {
    filename: path.basename(filePath),
    isAdult,
    title,
    franchise,
    characterTags,
    moodCategories,
    synopsis,
    content,
    length,
    tags
  };
}

/**
 * Optional: map franchise to a broad category (anime, tv, books, etc.)
 * For now we leave most as null and you can fill this in later if you want.
 */
function inferCategoryFromFranchise(franchise: string): string | null {
  const f = franchise.toLowerCase();

  // Very rough examples – extend as needed
  const animeKeywords = [
    "attack on titan",
    "jujutsu kaisen",
    "neon genesis evangelion",
    "fullmetal alchemist",
    "naruto",
    "inuyasha",
    "cowboy bebop",
    "toradora",
    "yuri!!! on ice",
    "clannad",
    "steins;gate"
  ];

  if (animeKeywords.some((k) => f.includes(k))) return "anime";

  const tvKeywords = [
    "breaking bad",
    "the expanse",
    "firefly",
    "doctor who",
    "westworld",
    "the walking dead",
    "true detective",
    "battlestar galactica"
  ];
  if (tvKeywords.some((k) => f.includes(k))) return "tv";

  const bookKeywords = [
    "stormlight archive",
    "mistborn",
    "the name of the wind",
    "wheel of time",
    "dark tower",
    "his dark materials",
    "ender's game"
  ];
  if (bookKeywords.some((k) => f.includes(k))) return "books";

  const filmKeywords = ["the matrix", "inception", "interstellar", "blade runner"];
  if (filmKeywords.some((k) => f.includes(k))) return "film";

  return null;
}

async function importStory(parsed: ParsedStory) {
  const category = inferCategoryFromFranchise(parsed.franchise);

  const payload = {
    title: parsed.title,
    franchise: parsed.franchise,
    category,
    is_adult: parsed.isAdult,
    length: parsed.length,
    tags: parsed.tags,
    mood_categories: parsed.moodCategories,
    synopsis: parsed.synopsis,
    content: parsed.content
  };

  if (DRY_RUN) {
    console.log("[DRY-RUN] Would insert:", parsed.filename, payload);
    return;
  }

  const { error } = await supabase.from("stories").insert(payload);

  if (error) {
    console.error(`Error inserting ${parsed.filename}:`, error.message);
  } else {
    console.log("[OK] Inserted", parsed.filename);
  }
}

async function main() {
  const dir = path.resolve(STORIES_DIR);
  if (!fs.existsSync(dir)) {
    throw new Error(`Stories directory does not exist: ${dir}`);
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith("story-") && f.endsWith(".txt"))
    .sort();

  console.log(`Found ${files.length} story files in ${dir}`);
  console.log(DRY_RUN ? "Running in DRY RUN mode" : "Running in COMMIT mode");

  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const parsed = parseStoryFile(fullPath);
      await importStory(parsed);
    } catch (err: any) {
      console.error(`[ERR] Failed to process ${file}:`, err.message || err);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
