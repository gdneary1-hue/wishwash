# WishWash: waitlist website

A landing page for **WishWash**, the car wash that comes to you. It isn't the app.
Its job is to find out whether people want the service: it collects waitlist
signups and measures which services, prices, and areas get the most interest.

- **Built with:** Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Signups saved to:** Supabase (a free hosted database)
- **Analytics:** Vercel Analytics (privacy-friendly, no cookie banner needed)
- **Hosting:** Vercel (free)

---

## 1. Edit the words, prices, and cities

**Everything you'd want to change lives in [`site.config.ts`](site.config.ts):**
headlines, the cities and zip codes in the launch area, service tiers and prices,
FAQ answers, your contact email, and your Instagram/TikTok links. Change the text,
save, and redeploy. You don't need to touch any other file.

- **Launch area:** `market.zipPrefixes` decides which zip codes count as "in area"
  by their first three digits. `680` and `681` cover Omaha; `685` covers Lincoln.
  Use `extraZips` to add individual zip codes. Signups from outside the area are
  still saved and flagged on the admin page.
- **Logo:** save your logo in `/public` (for example `/public/logo.png`), then set
  `logoSrc: "/logo.png"` and put the image's width and height in `logoWidth` and
  `logoHeight`. A **wide, tightly cropped** version works best in the nav bar. Until
  then the site shows a matching text wordmark.
- **Favicon (browser-tab icon):** replace `app/icon.svg`. The iPhone home-screen
  icon is drawn in `app/apple-icon.tsx`.

## 2. Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
cd ~/wishwash
npm install        # first time only
npm run dev
```

Open http://localhost:3000. Without a database set up, test signups are saved to
`.data/wishwash-db.json` on your computer, so you can try the form right away.

To see the admin page locally, create a file named `.env.local` in this folder:

```
ADMIN_PASSWORD=pick-something-long
```

Restart `npm run dev`, then go to http://localhost:3000/admin.

## 3. Set up the database (Supabase, free)

1. Create a free account at [supabase.com](https://supabase.com) and click **New project**.
2. In the project, open **SQL Editor**, paste this in, and click **Run**:

   ```sql
   create table signups (
     id uuid primary key default gen_random_uuid(),
     email text not null unique,
     zip text not null,
     in_area boolean not null,
     tier text,
     frequency text,
     expected_price numeric,
     source text,
     created_at timestamptz not null default now()
   );

   create table events (
     id bigint generated always as identity primary key,
     type text not null,
     value text,
     created_at timestamptz not null default now()
   );

   -- Lock both tables. Only the website's server (using the secret key) can read or write them.
   alter table signups enable row level security;
   alter table events enable row level security;
   ```

3. Go to **Project Settings → API** (it may be under **API Keys**) and copy two values:
   - **Project URL** → this becomes `SUPABASE_URL`
   - **service_role** secret key → this becomes `SUPABASE_SERVICE_ROLE_KEY`
     (keep it secret; never post it publicly)

**Viewing signups:** use your site's `/admin` page, or in Supabase open
**Table Editor → signups** to see every row. The admin page also has a
**Download CSV** button for Excel or Google Sheets.

## 4. Put it online (Vercel, free)

1. Put this folder on GitHub. The easiest way is [GitHub Desktop](https://desktop.github.com):
   **File → Add Local Repository →** choose the `wishwash` folder → **Publish repository**
   (keep it private).
2. Sign up at [vercel.com](https://vercel.com) with your GitHub account, click
   **Add New → Project**, and import the `wishwash` repository. No settings need to change.
3. Before clicking **Deploy**, open **Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | your Supabase Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service_role key |
   | `ADMIN_PASSWORD` | a long password for `/admin` |

4. Click **Deploy**. You'll get a live link like `wishwash.vercel.app`.
5. **Turn on analytics:** in your Vercel project, open the **Analytics** tab and click **Enable**.

After this, every time you push a change to GitHub, Vercel redeploys automatically.
If you change an environment variable later, redeploy (Deployments → ⋯ → Redeploy)
for it to take effect.

### Custom domain

Buy a domain (for example from Vercel, Namecheap, or Cloudflare). In Vercel, go to
**Settings → Domains**, add it, and follow the DNS instructions. Then add the
environment variable `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` and redeploy,
so link previews and the sitemap use your real domain.

## 5. Add your promo video

Put these files in `public/video/`:

| File | What it is |
| --- | --- |
| `promo.mp4` | the video (required) |
| `promo.webm` | a smaller copy for Chrome/Android (optional, recommended) |
| `promo-poster.jpg` | a still frame shown while the video loads (recommended) |

Redeploy. The site detects the files automatically and replaces the placeholder.
In the hero, the video plays silently on a loop inside the phone frame. In the
"See it in action" section, it has play controls and sound.

Set `video.aspect` in `site.config.ts` to `"vertical"` for a phone-shaped 9:16 video
(e.g. a TikTok/Reel) or `"horizontal"` for 16:9.

**Compress it with [ffmpeg](https://ffmpeg.org).** On a Mac, install it with
`brew install ffmpeg`. Run these from the folder that contains your original video:

```bash
# Web-friendly MP4, usually under 8 MB. If it's still too big, raise -crf (e.g. 30).
# For a horizontal video, change scale=-2:1280 to scale=1280:-2
ffmpeg -i original.mov -vf "scale=-2:1280,fps=30" -c:v libx264 -preset slow -crf 26 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k public/video/promo.mp4

# WebM version (smaller on Chrome/Android)
ffmpeg -i original.mov -vf "scale=-2:1280,fps=30" -c:v libvpx-vp9 -crf 36 -b:v 0 \
  -c:a libopus -b:a 96k public/video/promo.webm

# Poster image from the frame at 1 second
ffmpeg -ss 1 -i public/video/promo.mp4 -frames:v 1 -q:v 3 public/video/promo-poster.jpg
```

Check the size with `ls -lh public/video`.

## 6. What gets measured

| What | Where you see it |
| --- | --- |
| Total signups, signups by zip, in-area vs. outside | `/admin` |
| "I'd book this" clicks per tier (the fake-door test) | `/admin` + Vercel Analytics (`tier_click`) |
| Tier picked, wash frequency, expected price | `/admin` |
| Waitlist signups by source (hero, final section, tier buttons) | `/admin` table + Vercel Analytics (`waitlist_signup`) |
| Promo video plays | `/admin` + Vercel Analytics (`video_play`) |
| FAQ questions opened | Vercel Analytics (`faq_open`) |
| Share button clicks | Vercel Analytics (`share_click`) |

Note: custom events show in Vercel Analytics on paid Vercel plans. On the free
plan you still get visitor and page analytics, and the `/admin` page covers the
key interest numbers.

## How the waitlist works

1. A visitor enters email and zip, then gets their spot number ("You're #12 in line").
2. Three optional questions follow (tier, frequency, price). Visitors can skip them.
3. The success screen has share buttons (text, copy link, Facebook, X, and the phone's own share sheet).
4. Signing up twice with the same email returns the original spot instead of making a duplicate.
5. Spam protection: a hidden "honeypot" field that bots fill in and people never see,
   plus email and zip validation on the server.

## Project map

```
site.config.ts            ← all copy, prices, cities, links
app/page.tsx              ← the landing page (section order)
app/admin/page.tsx        ← password-protected dashboard
app/api/waitlist/         ← saves signups
app/api/event/            ← saves tier clicks / video plays
app/opengraph-image.tsx   ← link-preview image (1200×630)
app/icon.svg              ← favicon
components/sections/      ← one file per page section
components/waitlist/      ← the signup form + pop-up
lib/db.ts                 ← Supabase / local-file storage
```
