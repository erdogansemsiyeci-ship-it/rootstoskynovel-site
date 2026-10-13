# Roots to Sky

Static promotional website for *Roots to Sky*.

## Cover image

Place the final cover at `assets/cover.jpg`. The page automatically displays it when available; otherwise it shows the built-in “Cover reveal coming soon” placeholder. The cover image should be a portrait JPEG, ideally with a 2:3 ratio.

## Placeholders to fill

Replace the four marked values in the source:

- Supabase project URL
- Supabase anonymous key
- Amazon pre-order URL; its button becomes visible after it is replaced
- Goodreads URL; its button becomes visible after it is replaced

The newsletter expects a `rts_subscribers` table with `eposta` and `kaynak` columns and accepts an anonymous `POST` under the appropriate Supabase RLS policy.

## Deploy to Vercel

There is no build step. From this directory, run:

```bash
vercel --prod
```
