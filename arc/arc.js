/* ARC (early copy) request form -> Supabase rts_arc.
   Kural: anon anahtari yalniz INSERT yapabilir; "Prefer: return=minimal" ZORUNLU
   (yoksa PostgREST satiri geri okumaya calisir ve 401 doner).
   kaynak='kisisel' -> rts_arc.kaynak CHECK kisiti yalniz
   booksirens/kisisel/diaspora/bookstagram/youtube kabul eder. */
const supabaseUrl = "https://hgwmloczvvviumbjheje.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd21sb2N6dnZ2aXVtYmpoZWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjIyMTQsImV4cCI6MjEwNzAzODIxNH0.BoDiaQYeSk84Q5qUgRuWxkh_dyNSarVoXBy0xDBrm6c";

const form = document.getElementById("arc-form");
const message = document.getElementById("arc-message");
const submitButton = form.querySelector('button[type="submit"]');
const defaultButtonText = submitButton.textContent;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const ad = form.elements.ad.value.trim();
  const email = form.elements.email.value.trim().toLowerCase();
  const consent = form.elements.consent.checked;
  const honeypot = form.elements.website.value;

  if (!consent) {
    showMessage("Please tick the box so I may write to you.", true);
    return;
  }
  if (!ad) {
    form.elements.ad.reportValidity();
    return;
  }
  if (!form.elements.email.validity.valid) {
    form.elements.email.reportValidity();
    return;
  }
  if (honeypot) {
    showMessage("Thank you \u2014 your request is in.");
    form.reset();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending\u2026";
  showMessage("");
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rts_arc`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ ad: ad, eposta: email, kaynak: "kisisel" })
    });
    if (response.status === 200 || response.status === 201) {
      showMessage("Thank you \u2014 I have your request. The file will reach you by email before publication.");
      form.reset();
    } else if (response.status === 409) {
      showMessage("You are already on my list \u2014 no need to ask twice.");
      form.reset();
    } else {
      showMessage("That did not go through. Please try again.", true);
    }
  } catch (error) {
    showMessage("That did not go through. Please try again.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = defaultButtonText;
  }
});
