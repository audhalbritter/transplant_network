import { GATE_PASSWORD_SHA256_HEX } from "./config.js";
import { sha256HexUtf8 } from "./crypto-utils.js";

const SESSION_KEY = "transplant_portal_ok";

export function isGateUnlocked() {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function unlockGate() {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export async function verifyPassword(candidate) {
  const hex = await sha256HexUtf8(candidate);
  return hex.toLowerCase() === GATE_PASSWORD_SHA256_HEX.toLowerCase();
}

export function mountGate({ formEl, errorEl, onSuccess }) {
  if (isGateUnlocked()) {
    formEl.closest(".card")?.classList.add("hidden");
    onSuccess();
    return;
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    const input = formEl.querySelector('input[type="password"]');
    const ok = await verifyPassword(input.value);
    if (!ok) {
      errorEl.textContent = "Incorrect passphrase.";
      return;
    }
    unlockGate();
    formEl.closest(".card")?.classList.add("hidden");
    onSuccess();
  });
}
