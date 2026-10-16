import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { el, showNotice } from "./utils.js";

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const RENTANG_TAHUN = 60;

function isiOpsi(select, placeholder, items) {
  select.innerHTML = "";
  select.append(new Option(placeholder, ""));
  items.forEach(([value, text]) => select.append(new Option(text, value)));
}

function initTanggal() {
  const tahunIni = new Date().getFullYear();
  const hari = Array.from({ length: 31 }, (_, i) => [String(i + 1), String(i + 1)]);
  const bulan = BULAN.map((nama, i) => [String(i + 1), nama]);
  const tahun = Array.from({ length: RENTANG_TAHUN + 1 }, (_, i) => {
    const y = String(tahunIni - i);
    return [y, y];
  });

  isiOpsi(el("tglHari"), "Tanggal", hari);
  isiOpsi(el("tglBulan"), "Bulan", bulan);
  isiOpsi(el("tglTahun"), "Tahun", tahun);
}

function bacaTanggal() {
  const d = Number(el("tglHari").value);
  const m = Number(el("tglBulan").value);
  const y = Number(el("tglTahun").value);
  const date = new Date(y, m - 1, d);
  const valid = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  if (!valid) return { error: "Tanggal yang dipilih tidak ada di kalender." };
  if (date > new Date()) return { error: "Tanggal mulai bekerja tidak boleh di masa depan." };
  const pad = (n) => String(n).padStart(2, "0");
  return { value: `${y}-${pad(m)}-${pad(d)}` };
}

export function initForm() {
  initTanggal();

  el("employeeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = el("btnSubmit");
    const msg = el("formMsg");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const tanggal = bacaTanggal();
    if (tanggal.error) {
      showNotice(msg, tanggal.error, true);
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
        tanggalMasuk: tanggal.value,
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
