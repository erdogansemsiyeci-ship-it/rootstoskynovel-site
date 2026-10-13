/* Newsletter submission and local cover handling. */
const supabaseUrl = "https://hgwmloczvvviumbjheje.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd21sb2N6dnZ2aXVtYmpoZWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NjIyMTQsImV4cCI6MjEwNzAzODIxNH0.BoDiaQYeSk84Q5qUgRuWxkh_dyNSarVoXBy0xDBrm6c";

const cover = document.getElementById("book-cover");
const placeholder = document.getElementById("cover-placeholder");
const coverCheck = new Image();
coverCheck.onload = () => {
  cover.hidden = false;
  placeholder.hidden = true;
};
coverCheck.src = cover.src;

["preorder-link", "goodreads-link"].forEach((id) => {
  const link = document.getElementById(id);
  if (link && !link.getAttribute("href").includes("%%")) link.hidden = false;
});

const form = document.getElementById("newsletter-form");
const message = document.getElementById("form-message");
const submitButton = form.querySelector('button[type="submit"]');
const defaultButtonText = submitButton.textContent;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = form.elements.email.value.trim().toLowerCase();
  const consent = form.elements.consent.checked;
  const honeypot = form.elements.website.value;

  if (!consent) {
    showMessage("Please tick the box so we may write to you.", true);
    return;
  }
  if (!form.elements.email.validity.valid) {
    form.elements.email.reportValidity();
    return;
  }
  if (honeypot) {
    showMessage("Thank you — you are on the list.");
    form.reset();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  showMessage("");
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rts_subscribers`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ eposta: email, kaynak: "site" })
    });
    if (response.status === 200 || response.status === 201) {
      showMessage("Thank you — you are on the list.");
      form.reset();
    } else if (response.status === 409) {
      showMessage("You are already on the list.");
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
