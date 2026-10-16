import { state } from "./state.js";
import { el } from "./utils.js";
import { loadAdminData } from "./admin.js";

const VIEWS = ["formView", "loginView", "adminView"];

export function showView(viewId) {
  VIEWS.forEach((id) => el(id).classList.toggle("hidden", id !== viewId));
  el("navForm").classList.toggle("active", viewId === "formView");
  el("navAdmin").classList.toggle("active", viewId !== "formView");
  if (viewId === "adminView") loadAdminData();
  window.scrollTo(0, 0);
}

export function openAdmin() {
  showView(state.currentUser ? "adminView" : "loginView");
}
