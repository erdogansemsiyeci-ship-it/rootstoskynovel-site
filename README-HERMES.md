# Roots to Sky — site handoff (for Hermes)

Static site. No build step, no dependencies. Upload the folder as-is to the web root of rootstoskynovel.com.

## Files
- `index.html`: the whole page (hero, book, readers + early-copy form, author, newsletter, footer)
- `style.css`: all styling. Colours/fonts are CSS variables at the top.
- `config.js`: **the only file to edit**: webhook URLs and outbound links
- `site.js`: form handling and link wiring. No need to edit.
- `privacy.html`, `confirmed.html`, `unsubscribed.html`: small plain pages
- `assets/` (create it): `cover.jpg` (2:3, ~680×1020 or larger; the old site has `cover-print.jpg` and `cover.jpg`) and `author.jpg` (4:5). If a file is missing, the page shows a typographic placeholder (cover) or an empty frame (portrait) instead of a broken image.

## Before launch (checklist)
1. Fill `config.js`:
   - `earlyCopyUrl`, `newsletterUrl`: your webhook endpoints (HTTPS, CORS must allow `https://rootstoskynovel.com`)
   - `links`: amazon, goodreadsBook, amazonAuthor, goodreadsAuthor. Empty values hide that button, so nothing points to `#`.
2. Add `assets/cover.jpg` and `assets/author.jpg`.
3. Optional: add page count / ISBN / price. There is a commented line in `index.html` under "Available 24 November".
4. Serve over HTTPS. Redirect `www` to the bare domain (canonical is `https://rootstoskynovel.com/`).

## Form contract
Both forms POST `application/json`:

```json
{ "email": "reader@example.com", "consent": true, "source": "rootstoskynovel.com/#readers", "hp": "" }
```

- Early-copy form → `earlyCopyUrl`. Newsletter form → `newsletterUrl`.
- `hp` is a honeypot, always empty for humans. If it is non-empty, return `check_email` and store nothing.
- Respond with JSON `{ "status": "<value>" }`. The site shows a message per value:
  - `check_email`: confirmation email sent (both forms)
  - `full`: the 100 early copies are gone (early-copy form; newsletter form shows "you are on the list")
  - `invalid`: bad email or no consent
  - anything else / network error: generic "try again" message
- The full flow, rules and email texts are in the document **KOMUT: RTS-ERKEN-KOPYA**.

## Links the emails should use
- Confirmation link target: your webhook, then redirect to `https://rootstoskynovel.com/confirmed.html`
- Unsubscribe link target: your webhook, then redirect to `https://rootstoskynovel.com/unsubscribed.html`

## Notes
- No cookies, no analytics. Fonts load from Google Fonts.
- Keep the consent wording exactly as in the forms; it is what the stored consent refers to.
- `privacy.html` is a plain-language note. Review it once against your actual data handling (and local rules such as KVKK/GDPR) before launch.

---

## Deployment notes — Hermes, 2 November 2026

Deployed to `rootstoskynovel.com` (GitHub Pages, repo `erdogansemsiyeci-ship-it/rootstoskynovel-site`).
The page is live as designed. Deviations from the handoff, and why:

1. **Forms write straight to Supabase, not to a webhook.** Project decision of 8 October 2026: no service is
   exposed from the Hermes host; the static site inserts directly through PostgREST with an INSERT-only anon key.
   - `config.js` now carries `supabase: { url, key }`. `site.js` uses it when present and falls back to
     `earlyCopyUrl` / `newsletterUrl` (the original webhook contract) when it is empty — so a later switch
     to webhooks needs no code change.
   - Early copy → `rts_arc` (`ad` empty, `kaynak='kisisel'`; that CHECK constraint has no `site` value),
     newsletter → `rts_subscribers` (`kaynak='site'`).
   - HTTP 201 → `ok`, 409 (already registered) → `dup`. Because no confirmation mail is sent at request time,
     the honest messages are "Your request is in…" / "You are already on the list", not `check_email`.
   - Honeypot: filled → success shown, nothing stored.
   - Verified end to end in a real browser (Chromium, desktop + 390 px): ok / duplicate / invalid / honeypot paths,
     CORS preflight 200 with `Access-Control-Allow-Origin: *`. Test rows deleted afterwards.
2. **`assets/cover.jpg`** already existed (800×1200, 2:3) — used as is. **`assets/author.jpg` is still missing**,
   so the portrait frame is empty on purpose. Drop a 4:5 portrait in and it appears with no code change.
3. **`legacy.css`** is the previous `style.css`. `arc/index.html` and `unsubscribe/index.html` still use the old
   class names, so they now link to `legacy.css` and keep their look. The live unsubscribe link
   (`/unsubscribe/?e=…&t=…`) is untouched.
4. **Kept as before:** `CNAME`, `robots.txt`, `sitemap.xml`, `vercel.json`, `arc/`, `unsubscribe/`, `assets/`.
   The 31 October Goodreads reviews widget (`#reviews`) is **not** part of this design — it can be re-added if wanted.
5. **Open item:** the 100-copy cap is not enforced (the anon key cannot count rows) and ARC delivery
   (`arc_file_url` / `arc_delivery` in `rts_config`) is still empty, so early-copy requests are collected but the
   PDF email cannot go out yet.
