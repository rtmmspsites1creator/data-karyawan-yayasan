export const el = (id) => document.getElementById(id);

const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

export const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch]);

export function showNotice(node, text, isError) {
  node.textContent = text;
  node.classList.toggle("error", Boolean(isError));
  node.classList.remove("hidden");
}

export function selisihBulan(tanggal) {
  if (!tanggal) return null;
  const masuk = new Date(tanggal);
  if (Number.isNaN(masuk.getTime())) return null;
  const now = new Date();
  let total = (now.getFullYear() - masuk.getFullYear()) * 12 + (now.getMonth() - masuk.getMonth());
  if (now.getDate() < masuk.getDate()) total--;
  return total < 0 ? null : total;
}

export function formatMasaKerja(bulan) {
  if (bulan === null) return "-";
  const tahun = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  if (tahun === 0 && sisa === 0) return "Kurang dari 1 bulan";
  if (tahun === 0) return `${sisa} bulan`;
  if (sisa === 0) return `${tahun} tahun`;
  return `${tahun} tahun ${sisa} bulan`;
}

export function formatTanggal(tanggal) {
  const d = new Date(tanggal);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
