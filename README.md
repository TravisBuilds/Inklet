# Inklet – AI-First Wattpad-Style Fiction Platform

Inklet is an AI-driven fanfiction and original fiction platform inspired by Wattpad, with:

- Massive AI-generated story inventory (seeded by platform)
- Fan-driven discovery (categories, upvotes, comments)
- Adult content behind a paywall
- Profit-sharing with creators (including AI-assisted ones)
- Minimal friction for readers (no login needed for free content)
- Auth only required for adult content, comments, upvotes, and AI creation

---

## 1. Product Overview

**Goal:**  
Build an AI-first reading platform where:

- Majority of catalog is AI-generated, curated by Inklet.
- Users can generate and submit new stories with AI assistance.
- Users can read for free, except for paywalled adult content.
- Revenue from subscriptions & adult content is shared with creators.
- Creators are mostly hidden in the UI (stories branded as “Inklet Originals”).

**Core principles:**

1. Read-first, minimal login friction.
2. AI-native creation flows.
3. Soft anonymity for authors.
4. Clean, premium handling of adult/paywalled content.

---

## 2. Roles

### Anonymous Reader
- Can: browse & read all non-adult stories.
- Cannot: view adult content, comment, upvote, or create stories.

### Logged-In Free User
- Can: everything anonymous can + comment, upvote, bookmark, use AI builder (limited).
- Cannot: view adult content.

### Subscriber
- Can: everything free users can + view adult/paywalled stories.
- Their subscription contributes to a shared revenue pool for creators.

### Creator
- Any user with published stories (AI-assisted or manual).
- Tracked in backend for payouts.
- Public UI: stories labeled as “Inklet Originals” by default.

---

## 3. Key Features

### 3.1 Story Browsing & Discovery
- Home:
  - Featured collections (hot K-pop, top anime, trending adult).
- Filters:
  - Category: kpop / anime / western / gaming / original.
  - Subcategory: fandom (BTS, Marvel, etc.).
  - Length: short / medium / long.
  - Adult toggle (only visible for logged-in & subscribed users).

### 3.2 Story Reader
- Clean title, metadata (category, subcategory, length).
- “Adult” badge if `is_adult`.
- Reading controls: font size, dark mode (later).
- End-of-story: upvote, comments, related stories.

### 3.3 Comments & Upvotes
- Comments require login.
- Upvotes require login.
- Used for trending ranking.

### 3.4 Adult Paywall
- `is_adult === true` stories:
  - Preview section available to everyone.
  - Full content only for logged-in subscribers.
  - Soft modal paywall prompts user to subscribe.

### 3.5 AI Prompt Builder
- Steps:
  - Choose Category (K-Pop, Anime, Western, Gaming, Original).
  - Choose Fandom/Subcategory.
  - Choose Tone (romantic, dark, etc.).
  - Choose Length (short/medium/long).
  - Enter freeform prompt.
- Backend generates story; user can edit and publish.
- Adult toggle only if user is subscribed.

---

## 4. React UI Architecture

- Tech: Vite + React + TypeScript.
- Structure:

  - `src/context/AuthContext.tsx`
    - Holds `isLoggedIn`, `isSubscribed`, and methods to simulate login/subscribe.
  - `src/types.ts`
    - Shared types for stories, categories, etc.
  - `src/api/storiesApi.ts`
    - For now: mock data & API; later replaced with real backend calls.
  - `src/components`
    - `Layout` (page shell)
    - `Header`
    - `StoryList`, `StoryCard`, `StoryFilters`
    - `StoryReader`
    - `CommentList`, `CommentForm`
    - `PaywallModal`
    - `AiPromptBuilder`
  - `src/App.tsx`
    - Handles basic “routing” between Home, Explore, Read, Create.

---

## 5. Roadmap

1. Implement front-end with mock APIs (this repo).
2. Connect to real backend that:
   - Reads `content_matrix.json` and `.txt` story files.
   - Exposes `/api/stories` and `/api/stories/:id`.
   - Manages auth and subscription state.
3. Integrate AI generation endpoint `/api/ai/generate-story`.
4. Implement creator payout reporting and dashboards.

