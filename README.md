# Pendataan Karyawan

Aplikasi statis (HTML + ES Modules) dengan Firebase Firestore dan Authentication.

## Struktur

```
index.html
css/styles.css
js/
  main.js            titik masuk, mengekspos fungsi global untuk atribut inline
  firebase.js        inisialisasi app, db, auth
  config.js          konfigurasi Firebase asli (TIDAK di-commit)
  config.example.js  templat konfigurasi (aman di-commit)
  state.js           state bersama
  utils.js           helper tampilan dan tanggal
  views.js           navigasi antar tampilan
  auth.js            login, logout, pemantau sesi
  form.js            pengiriman formulir
  admin.js           rekap, filter, urutan, statistik
firestore.rules      aturan keamanan Firestore
firebase.json        hosting, header keamanan, rules
```

## Setup

1. `cp js/config.example.js js/config.js` lalu isi dengan config dari Firebase Console.
2. Pastikan `js/config.js` tidak muncul di `git status` sebelum commit pertama.
3. `firebase use <project-id>` lalu `firebase deploy --only firestore:rules,hosting`.

## Menambah administrator

1. Authentication > Users > tambahkan akun email/kata sandi.
2. Salin UID akun tersebut.
3. Firestore > buat koleksi `admins` > dokumen dengan Document ID = UID (isi field bebas, misal `aktif: true`).

Akun tanpa dokumen di `admins` tidak dapat membaca data, walau berhasil login.

## Checklist keamanan

- Publish `firestore.rules` sebelum aplikasi dipakai. Ini pertahanan utama, karena API key Firebase web tidak dapat dirahasiakan di sisi klien.
- Google Cloud Console > APIs & Services > Credentials > Browser key: batasi HTTP referrer ke domain hosting Anda, dan batasi API ke Identity Toolkit, Cloud Firestore, dan Token Service.
- Authentication > Settings: nonaktifkan pendaftaran mandiri jika opsinya tersedia.
- Aktifkan Firebase App Check (reCAPTCHA Enterprise) untuk Firestore agar formulir publik sulit di-spam.
- Jika API key lama sudah pernah terkirim ke tempat publik, buat key baru lalu hapus yang lama.
- GitHub Pages tidak cocok karena `config.js` tidak ikut ter-commit. Gunakan Firebase Hosting.
