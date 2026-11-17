# SKENARIO DEMONSTRASI PENGUJIAN JURI FISION 2026
## 10 Alur Pengujian Komprehensif Prototipe JALIN BELAJAR

Ikuti 10 langkah demonstrasi terpadu di bawah ini saat mempresentasikan prototipe kepada dewan juri:

---

### Skenario 1: Login sebagai Dinas Pendidikan & Analisis Peta Daerah 3T
1. Beralih ke peran **Dinas Pendidikan** melalui menu *Role Switcher* di bilah atas.
2. Amati **Dashboard Dinas**: Muncul statistik agregat Kabupaten Mukomuko (Rerata Literasi 60.7, Rerata Numerasi 54.6, 6 Satuan Pendidikan terdata).
3. Buka menu **JALIN-PETA > Pemetaan Sekolah & 3T**:
   - Tunjukkan filter jenjang SD / SMP dan filter "Hanya Wilayah 3T / Terisolir".
   - Tunjukkan tombol **"Tambah Satuan Pendidikan"** dan peragakan penambahan data sekolah baru. Data tersimpan permanen di IndexedDB.
4. Buka menu **JALIN-PETA > Kondisi Infrastruktur**:
   - Tunjukkan diagram batang ketersediaan listrik (PLN 24 Jam vs PLN Terbatas vs Genset) dan diagram lingkaran sinyal internet.
5. Buka menu **JALIN-PETA > Sebaran Capaian**:
   - Tunjukkan grafik komparasi kesenjangan skor sekolah pusat kota (SDN 01 Kota Mukomuko: 82.6) vs sekolah pedalaman (SDN 08 Malin Deman: 39.5).

---

### Skenario 2: Login sebagai Kepala Sekolah & Evaluasi Kesiapan Sekolah
1. Beralih ke peran **Kepala Sekolah (Sri Wahyuni, SDN 05 Air Rami)**.
2. Dashboard otomatis menyesuaikan data spesifik SDN 05 Air Rami:
   - Terlihat kondisi listrik: *PLN Terbatas* (kerap padam saat cuaca buruk).
   - Terlihat rasio perangkat: 6 tablet untuk 142 murid.
3. Buka menu **PETA > Satuan Pendidikan > SDN 05 Air Rami (Detail)** untuk melihat catatan khusus dan rekomendasi intervensi.

---

### Skenario 3: Login sebagai Guru & Pembuatan Asesmen Diagnostik
1. Beralih ke peran **Guru (Siti Rahmawati - Guru Kelas 5)**.
2. Buka menu **JALIN-TUNTAS > Asesmen Diagnostik**.
3. Klik tombol **"Buat Paket Asesmen"**:
   - Masukkan judul: `Asesmen Diagnostik Formatif Kelas 5 SD`.
   - Pilih domain: `Numerasi`, Jenjang: `SD`, Waktu: `20 Menit`.
   - Klik **"Buat Asesmen"**. Paket baru langsung muncul di daftar asesmen aktif.

---

### Skenario 4 & 5: Login sebagai Siswa, Mengerjakan Ujian, dan Analisis Nilai Otomatis
1. Beralih ke peran **Siswa (Rizky Pratama Mukomuko)**.
2. Klik tombol **"Kerjakan Asesmen Diagnostik"** di banner dashboard siswa.
3. Pilih paket asesmen dan klik **"Mulai Kerjakan Soal"**:
   - Terbuka lembar pengerjaan interaktif lengkap dengan penunjuk waktu (*countdown timer*) dan palet nomor soal.
   - Jawab soal satu per satu (misal pilih A atau B).
4. Klik tombol **"Kumpulkan Ujian"**:
   - Sistem **menghitung secara matematis** jawaban benar vs salah.
   - Efek selebrasi confetti muncul jika mencapai batas tuntas.
   - Muncul halaman hasil komprehensif: skor akhir, rincian kompetensi tuntas vs belum tuntas, dan ulasan pembahasan soal.

---

### Skenario 6: Pembuktian Algoritma Rekomendasi Adaptif (Preskriptif)
1. Pada halaman hasil pengerjaan siswa, scroll ke bagian **"Rekomendasi Pembelajaran Adaptif (JALIN-TUNTAS)"**.
2. Bila siswa salah menjawab soal pecahan, sistem secara otomatis merujuk ke modul:  
   👉 **"Operasi Pecahan Dasar: Menyamakan Penyebut dengan KPK"**.
3. Ini membuktikan bahwa rekomendasi bukan teks acak, melainkan preskripsi berbasis aturan (*rule-based prescriptive learning*) yang dapat dipertanggungjawabkan secara pedagogik.

---

### Skenario 7: Siswa Belajar Modul dan Latihan Mandiri
1. Klik tombol **"Buka Modul Ini"** pada kartu rekomendasi.
2. Siswa membaca modul teks kontekstual kue tat khas Bengkulu.
3. Klik tombol **"Mulai Latihan Pemahaman"**:
   - Siswa menjawab latihan soal.
   - Pilihan jawaban langsung diperiksa dengan umpan balik instan (*immediate feedback*).
   - Nilai sesi latihan tercatat ke riwayat belajar.

---

### Skenario 8: Guru Melihat Perkembangan Siswa
1. Beralih kembali ke peran **Guru (Siti Rahmawati)**.
2. Buka menu **JALIN-TUNTAS > Analisis & Rekomendasi**:
   - Guru dapat melihat nama Rizky Pratama telah masuk dalam rekap penilaian beserta skor dan daftar modul remedial yang disarankan.

---

### Skenario 9: Uji Coba Mode Luring (Offline-First)
1. Klik tombol **"Terhubung Daring"** di pojok kanan atas hingga berubah menjadi **"Mode Luring (3T)"**.
2. Buka menu **JALIN-HUB > Materi Tersimpan Luring**:
   - Seluruh modul yang telah disimpan dapat dibuka dan dibaca tanpa hambatan meski tidak ada koneksi.

---

### Skenario 10: Simulasi Antrean dan Riwayat Sinkronisasi
1. Buka menu **JALIN-HUB > Pusat Sinkronisasi**:
   - Tunjukkan item yang berstatus `PENDING` di kartu antrean lokal.
2. Nonaktifkan Mode Luring (klik kembali menjadi online).
3. Klik tombol **"Proses Antrean Sinkronisasi"**:
   - Sistem mensimulasikan transmisi data dengan animasi indikator putar.
   - Antrean berubah menjadi kosong dan status pengerjaan ditandai tersinkron dengan penambahan entri pada riwayat sinkronisasi.

