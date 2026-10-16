import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./firebase.js";
import { state } from "./state.js";
import { el, escapeHtml, selisihBulan, formatMasaKerja, formatTanggal } from "./utils.js";

const COLS = 6;

const messageRow = (text, isError) =>
  `<tr><td colspan="${COLS}" class="state${isError ? " error" : ""}">${text}</td></tr>`;

function updateStats(data) {
  el("statTotal").textContent = data.length;
  el("statYayasan").textContent = new Set(
    data.map((x) => String(x.yayasan || "").trim().toLowerCase()).filter(Boolean)
  ).size;

  const bulan = data.map((x) => selisihBulan(x.tanggalMasuk)).filter((x) => x !== null);
  el("statAvg").textContent = bulan.length
    ? formatMasaKerja(Math.round(bulan.reduce((a, b) => a + b, 0) / bulan.length))
    : "-";
}

function sortList(list) {
  const tgl = (x) => new Date(x.tanggalMasuk).getTime() || 0;
  const byNama = (a, b) =>
    String(a.nama).localeCompare(String(b.nama), "id", { sensitivity: "base" });
  const sorters = {
    namaAsc: byNama,
    namaDesc: (a, b) => byNama(b, a),
    masaKerjaOld: (a, b) => tgl(a) - tgl(b),
    masaKerjaNew: (a, b) => tgl(b) - tgl(a)
  };
  return [...list].sort(sorters[state.activeSort] || sorters.masaKerjaOld);
}

function filterList(list) {
  const q = el("searchInput").value.trim().toLowerCase();
  if (!q) return list;
  return list.filter((x) =>
    [x.nama, x.nik, x.yayasan].some((v) => String(v ?? "").toLowerCase().includes(q))
  );
}

export function renderView() {
  const tbody = el("tableBody");
  const rows = sortList(filterList(state.employees));
  updateStats(state.employees);

  if (!rows.length) {
    tbody.innerHTML = messageRow(
      state.employees.length ? "Tidak ada data yang cocok." : "Belum ada data karyawan."
    );
    return;
  }

  tbody.innerHTML = rows.map((emp, i) => `
    <tr>
      <td class="col-no num">${i + 1}</td>
      <td class="col-name">${escapeHtml(emp.nama)}</td>
      <td class="num">${escapeHtml(emp.nik)}</td>
      <td>${escapeHtml(emp.yayasan)}</td>
      <td class="num">${formatTanggal(emp.tanggalMasuk)}</td>
      <td>${formatMasaKerja(selisihBulan(emp.tanggalMasuk))}</td>
    </tr>`).join("");
}

export async function loadAdminData() {
  el("tableBody").innerHTML = messageRow("Memuat data...");

  try {
    const snapshot = await getDocs(collection(db, "employees"));
    state.employees = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderView();
  } catch (err) {
    const denied = err && err.code === "permission-denied";
    el("tableBody").innerHTML = messageRow(
      denied ? "Akun ini tidak memiliki akses administrator." : "Data gagal dimuat.",
      true
    );
  }
}

export function sortData(criteria) {
  state.activeSort = criteria;
  renderView();
}
