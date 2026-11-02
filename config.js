/* The only file that needs editing before launch.
   Empty link values hide that link/button automatically. */
window.SITE_CONFIG = {
  // Optional webhook endpoints (JSON POST: { email, consent, source, hp }).
  // Leave empty: the forms write straight to Supabase (project decision, 8 Oct 2026).
  earlyCopyUrl: "",
  newsletterUrl: "",

  // Supabase project (anon key, INSERT + flag read only — safe to publish).
  supabase: {
    url: "https://hgwmloczvvviumbjheje.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd21sb2N6dnZ2aXVtYmpoZWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjIyMTQsImV4cCI6MjEwNzAzODIxNH0.BoDiaQYeSk84Q5qUgRuWxkh_dyNSarVoXBy0xDBrm6c"
  },

  // Goodreads reviews widget. Mounted only after the first review exists
  // (flag rts_site_flags.reviews_live). Colours follow the site palette:
  // links=teal #17606B, stars=amber #E3AE72, text=body #2B3F47, review_back=band #E6ECE9.
  reviewsWidgetUrl: "https://www.goodreads.com/api/reviews_widget_iframe?did=DEVELOPER_ID&format=html&header_text=Reader+reviews+for+Roots+to+Sky&isbn=9798161969397&links=17606B&review_back=E6ECE9&stars=E3AE72&text=2B3F47",

  // Outbound links
  links: {
    amazon: "https://www.amazon.com/dp/B0HNQYGJZV",                     // Kindle edition / pre-order
    goodreadsBook: "https://www.goodreads.com/book/show/262037465-roots-to-sky",
    amazonAuthor: "https://www.amazon.com/stores/author/B0HNTGT7TY",
    goodreadsAuthor: "https://www.goodreads.com/author/show/54356142.Erdogan_Semsiyeci",
    authorSite: "https://www.satmetot.app"
  }
};
