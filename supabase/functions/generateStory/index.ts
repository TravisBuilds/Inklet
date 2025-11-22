// Supabase Edge Function: generateStory
/// <reference path="../deno.d.ts" />

// @ts-expect-error - Deno HTTP imports work at runtime
import { serve } from "https://deno.land/std@0.182.0/http/server.ts";
// @ts-expect-error - Deno HTTP imports work at runtime
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
// @ts-expect-error - Deno HTTP imports work at runtime
import OpenAI from "https://esm.sh/openai@4.47.1";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!
});

serve(async (req) => {
  try {
    const { franchise, characters, mood, isAdult, userPrompt } =
      await req.json();

    // 1. Story generation prompt
    const storyPrompt = `
Write a highly engaging, emotional ${isAdult ? "adult (18+)" : "PG-13"} fanfiction.
Universe: ${franchise}
Characters: ${characters || "not specified"}
Mood: ${mood || "default emotional tone"}
Length: 3–6 pages
User request: ${userPrompt}

Requirements:
- Give the story a clear beginning, middle, and ending
- Use rich emotional detail
- Keep it in universe tone
- NO formatting like **bold** or ### headers
- Produce clean paragraph text only
`;

    const storyResp = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [{ role: "user", content: storyPrompt }],
      temperature: 0.9,
      max_tokens: 6000
    });

    const content = storyResp.choices[0].message.content ?? "";

    // 2. Title + synopsis generation
    const metaResp = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        {
          role: "user",
          content: `
Based on the following story, generate:
1. A compelling short title (max 8 words)
2. A 1-3 sentence synopsis
Story:
${content}
`
        }
      ]
    });

    const meta = metaResp.choices[0].message.content ?? "";
    const [rawTitle, rawSynopsis] = meta.split("\n").map((s) => s.trim());

    const title = rawTitle.replace(/^Title:\s*/i, "");
    const synopsis = rawSynopsis.replace(/^Synopsis:\s*/i, "");

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from("stories")
      .insert({
        title,
        synopsis,
        content,
        franchise,
        is_adult: isAdult,
        mood_categories: mood ? [mood] : [],
        tags: characters
          ? characters.split(",").map((t) => t.trim())
          : [],
        length: "medium"
      })
      .select("id")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, storyId: data.id }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500 }
    );
  }
});
