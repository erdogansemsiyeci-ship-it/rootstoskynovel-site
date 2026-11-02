/* The only file that needs editing before launch.
   Empty link values hide that link/button automatically. */
window.SITE_CONFIG = {
  // Optional webhook endpoints (JSON POST: { email, consent, source, hp }).
  // Leave empty: the forms write straight to Supabase (project decision, 8 Oct 2026).
  earlyCopyUrl: "",
  newsletterUrl: "",

  // Supabase project (anon key, INSERT only — safe to publish).
  supabase: {
    url: "https://hgwmloczvvviumbjheje.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd21sb2N6dnZ2aXVtYmpoZWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjIyMTQsImV4cCI6MjEwNzAzODIxNH0.BoDiaQYeSk84Q5qUgRuWxkh_dyNSarVoXBy0xDBrm6c"
  },

  // Outbound links
  links: {
    amazon: "https://www.amazon.com/dp/B0HNQYGJZV",                     // Kindle edition / pre-order
    goodreadsBook: "https://www.goodreads.com/book/show/262037465-roots-to-sky",
    amazonAuthor: "https://www.amazon.com/stores/author/B0HNTGT7TY",
    goodreadsAuthor: "https://www.goodreads.com/author/show/54356142.Erdogan_Semsiyeci",
    authorSite: "https://www.satmetot.app"
  }
};
