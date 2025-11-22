# Deploying Inklet to Vercel

This guide will help you deploy your Inklet app to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your Supabase project URL and anon key
- GitHub repository (already set up)

## Step 1: Prepare Environment Variables

You'll need to set these environment variables in Vercel:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

You can find these in your Supabase project settings: https://app.supabase.com/project/_/settings/api

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository (`TravisBuilds/Inklet`)
3. Vercel will auto-detect it's a Vite project
4. Add your environment variables:
   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` with your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project:
   ```bash
   cd /Users/traviswu/Desktop/Inklet/App/inklet
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. When prompted, add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

6. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Supabase Edge Function (if needed)

If you're using the `generateStory` Edge Function, make sure it's deployed to Supabase:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy generateStory
```

## Step 4: Update API Endpoints (if needed)

If your Supabase Edge Function URL changes, update it in:
- `src/components/AiStoryGenerator.tsx` (line 44)

## Troubleshooting

### Build Errors
- Make sure all environment variables are set in Vercel
- Check that `package.json` has the correct build script: `"build": "tsc -b && vite build"`

### Runtime Errors
- Verify environment variables are prefixed with `VITE_` for Vite to expose them
- Check browser console for missing environment variables

### CORS Issues
- Make sure your Supabase project allows requests from your Vercel domain
- Check Supabase project settings for CORS configuration

## Post-Deployment

After deployment, your app will be available at:
- `https://your-project-name.vercel.app`

You can also set up a custom domain in Vercel project settings.

