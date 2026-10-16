import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { el, showNotice } from "./utils.js";

export function initForm() {
  el("employeeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = el("btnSubmit");
    const msg = el("formMsg");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btn.textContent = "Mengirim...";
    btn.disabled = true;
    msg.classList.add("hidden");

    try {
      await addDoc(collection(db, "employees"), {
        nama: el("nama").value.trim(),
        nik: el("nik").value.trim(),
        yayasan: el("yayasan").value.trim(),
        tanggalMasuk: el("tglMasuk").value,
        createdAt: serverTimestamp()
      });
      form.reset();
      showNotice(msg, "Data berhasil dikirim. Terima kasih.", false);
    } catch (err) {
      showNotice(msg, "Data gagal dikirim. Periksa koneksi lalu coba lagi.", true);
    } finally {
      btn.textContent = "Kirim data";
      btn.disabled = false;
    }
  });
}
