# JALIN BELAJAR — PANDUAN PENGOPERASIAN PROTOTIPE
## Inovasi Teknologi Pendidikan Berbasis Data untuk Wilayah 3T
**Wilayah Implementasi Awal:** Kabupaten Mukomuko, Provinsi Bengkulu  
**Kompetisi:** FISION 2026 National EdTech Innovation Prototype  

---

## 1. Ringkasan Eksekutif Produk

**JALIN BELAJAR** (*Jejaring Aksi Literasi dan Numerasi Berbasis Data*) adalah sistem prototipe EdTech yang dirancang khusus untuk memecahkan kesenjangan mutu pendidikan di wilayah 3T (Tertinggal, Terdepan, dan Terluar). 

Aplikasi ini mengintegrasikan 4 modul terpadu:
1. **JALIN-PETA:** Pemetaan kondisi riil sekolah, status kelistrikan, konektivitas internet, ketersediaan perangkat TIK, dan rerata capaian asesmen per kecamatan di Kabupaten Mukomuko.
2. **JALIN-TUNTAS:** Modul inti pembelajaran adaptif berbasis diagnostik. Sistem menghitung skor jawaban siswa, memetakan kelemahan kompetensi dasar (misal: penjumlahan pecahan), dan merekomendasikan modul remedial preskriptif secara otomatis.
3. **JALIN-GURU:** Pusat pendampingan pendidik, panduan teknis interpretasi hasil diagnostik, log supervisi guru koordinator, serta forum berbagi praktik baik kontekstual 3T.
4. **JALIN-HUB:** Pusat sumber belajar luring (*Offline-First*) yang memungkinkan seluruh materi dan lembar asesmen disimpan di IndexedDB peramban tablet lokal serta dilengkapi antrean sinkronisasi saat terhubung sinyal.

---

## 2. Cara Menjalankan Prototipe Secara Lokal

### Prasyarat:
- Node.js versi 18+ (telah terpasang versi v24.14.1)
- Google Chrome atau peramban modern berbasis Chromium

### Langkah Menjalankan:
1. Buka terminal di folder `d:\Jalin Belajar`
2. Jalankan perintah pengembangan lokal:
   ```bash
   npm run dev
   ```
3. Buka URL yang muncul di peramban: `http://localhost:3000` (atau port yang tertera)
4. Aplikasi langsung memuat data sintetis bawaan (*auto-seed*) ke IndexedDB.

---

## 3. Matriks 6 Akun Demonstrasi

Aplikasi telah dilengkapi fitur **Role Switcher** instan pada pojok kanan atas bilah navigasi dan halaman Login:

| Peran | Nama Akun | Username | Sekolah / Afiliasi | Fokus Tampilan Dashboard |
|---|---|---|---|---|
| **Super Admin** | Bambang Irawan, M.Kom | `admin` | Administrator IT JALIN | Manajemen database IndexedDB, reset data bawaan, status antrean sinkronisasi |
| **Dinas Pendidikan** | Drs. H. Ruslan Effendi, M.Pd | `dinas` | Dinas Pendidikan Kab. Mukomuko | Peta disparitas capaian literasi/numerasi antar-kecamatan & prioritas alokasi bantuan |
| **Kepala Sekolah** | Sri Wahyuni, S.Pd., M.M. | `kepsek` | SDN 05 Air Rami (3T Pesisir) | Evaluasi rasio TIK (1:23 siswa), jadwal listrik padam, keaktifan guru |
| **Guru Koordinator** | Ahmad Fauzi, M.Pd. | `koordinator` | Penggerak 3T Mukomuko Selatan | Log pendampingan supervisi guru, kurasi artikel praktik baik |
| **Guru Kelas** | Siti Rahmawati, S.Pd. | `guru` | SDN 05 Air Rami (Kelas 5 SD) | Pembuatan paket asesmen diagnostik, rekap nilai siswa, tindak lanjut remedial |
| **Peserta Didik (Siswa)** | Rizky Pratama Mukomuko | `siswa` | SDN 05 Air Rami (Kelas 5 SD) | Pengerjaan asesmen waktu nyata, ulasan jawaban, rekomendasi materi adaptif |

---

## 4. Demonstrasi Fitur Offline-First (Tanpa Internet)

Prototipe ini membuktikan bagaimana aplikasi tetap berfungsi 100% saat wilayah 3T mengalami pemadaman listrik atau *blankspot* internet:
1. Klik tombol **"Terhubung Daring"** di pojok kanan atas untuk mengaktifkan **"Mode Luring (3T)"**.
2. Banner peringatan kuning akan muncul menandakan aplikasi berjalan secara luring.
3. Masuk sebagai **Siswa** dan kerjakan asesmen diagnostik.
4. Klik **Kumpulkan Ujian**. Perhatikan bahwa:
   - Nilai tetap dihitung secara instan secara matematis di browser.
   - Analisis penguasaan kompetensi tetap terbentuk.
   - Jawaban disimpan ke antrean lokal IndexedDB (`syncQueue`).
   - Tombol indikator menunjukkan antrean bertambah (misal: *1 Antrean*).
5. Klik tombol **"Mode Luring"** kembali untuk mensimulasikan siswa/guru telah kembali ke area berinternet (misal: kantor kecamatan/desa).
6. Klik **"Proses Antrean Sinkronisasi"** di menu JALIN-HUB untuk melihat simulasi sinkronisasi data ke server pusat.

