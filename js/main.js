import { initAuth, handleLogout } from "./auth.js";
import { initForm } from "./form.js";
import { showView, openAdmin } from "./views.js";
import { renderView, sortData } from "./admin.js";

Object.assign(window, { showView, openAdmin, handleLogout, renderView, sortData });

initAuth();
initForm();
