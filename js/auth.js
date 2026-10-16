import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { state } from "./state.js";
import { el, showNotice } from "./utils.js";
import { showView } from "./views.js";

export function initAuth() {
  onAuthStateChanged(auth, (user) => {
    state.currentUser = user;
    if (!user && !el("adminView").classList.contains("hidden")) {
      showView("loginView");
    }
  });

  el("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = el("btnLogin");
    const errBox = el("loginError");
    btn.disabled = true;
    errBox.classList.add("hidden");

    try {
      await signInWithEmailAndPassword(auth, el("adminEmail").value.trim(), el("adminPass").value);
      e.target.reset();
      showView("adminView");
    } catch (err) {
      showNotice(errBox, "Email atau kata sandi tidak sesuai.", true);
    } finally {
      btn.disabled = false;
    }
  });
}

export async function handleLogout() {
  await signOut(auth);
  state.employees = [];
  el("searchInput").value = "";
  showView("formView");
}
