/* Unsubscribe — link tabanli cikis.
   Akis: e-posta altbilgisindeki ?e=<eposta>&t=<token> -> bu sayfa -> rts_unsub_requests'e INSERT.
   Kural: anon anahtari yalniz INSERT yapabilir; "Prefer: return=minimal" ZORUNLU.
   Token dogrulamasi sunucu tarafinda (scripts/rts_unsub.py, HMAC) yapilir. */
const supabaseUrl = "https://hgwmloczvvviumbjheje.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd21sb2N6dnZ2aXVtYmpoZWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjIyMTQsImV4cCI6MjEwNzAzODIxNH0.BoDiaQYeSk84Q5qUgRuWxkh_dyNSarVoXBy0xDBrm6c";

const params = new URLSearchParams(window.location.search);
const email = (params.get("e") || "").trim().toLowerCase();
const token = (params.get("t") || "").trim();

const form = document.getElementById("unsub-form");
const intro = document.getElementById("unsub-intro");
const fallback = document.getElementById("unsub-fallback");
const message = document.getElementById("unsub-message");
const emailField = document.getElementById("unsub-email");
const submitButton = form.querySelector('button[type="submit"]');

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

if (!email || !token) {
  intro.hidden = true;
  fallback.hidden = false;
} else {
  form.hidden = false;
  emailField.value = email;
  intro.textContent = "You are about to unsubscribe " + email + ". One click and it is done.";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  submitButton.textContent = "Sending\u2026";
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rts_unsub_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ eposta: email, token: token, kaynak: "site" }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    form.hidden = true;
    fallback.hidden = true;
    intro.hidden = false;
    intro.textContent = "Done. You are off the list \u2014 thank you for having read this far.";
  } catch (err) {
    showMessage("That did not go through. Write to info@rootstoskynovel.com and I will remove you by hand.", true);
    submitButton.disabled = false;
    submitButton.textContent = "Unsubscribe me";
  }
});
