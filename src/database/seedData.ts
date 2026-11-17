import { 
  User, 
  School, 
  Competency, 
  Question, 
  Material, 
  Assessment, 
  BestPracticePost, 
  MentoringNote 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Bambang Irawan, M.Kom',
    username: 'admin',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    nipNisn: '19840312 200801 1 004'
  },
  {
    id: 'usr-dinas',
    name: 'Drs. H. Ruslan Effendi, M.Pd',
    username: 'dinas',
    role: 'dinas_pendidikan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    nipNisn: '19710815 199603 1 002'
  },
  {
    id: 'usr-kepsek',
    name: 'Sri Wahyuni, S.Pd., M.M.',
    username: 'kepsek',
    role: 'kepala_sekolah',
    schoolId: 'sch-01',
    schoolName: 'SDN 05 Air Rami (3T Pesisir)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    nipNisn: '19760520 200212 2 001'
  },
  {
    id: 'usr-koordinator',
    name: 'Ahmad Fauzi, M.Pd.',
    username: 'koordinator',
    role: 'guru_koordinator',
    schoolId: 'sch-01',
    schoolName: 'SDN 05 Air Rami (3T Pesisir)',
    subject: 'Penggerak Literasi & Numerasi Wilayah Mukomuko Selatan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    nipNisn: '19880914 201101 1 006'
  },
  {
    id: 'usr-guru',
    name: 'Siti Rahmawati, S.Pd.',
    username: 'guru',
    role: 'guru',
    schoolId: 'sch-01',
    schoolName: 'SDN 05 Air Rami (3T Pesisir)',
    gradeLevel: 'Kelas 5 SD',
    subject: 'Guru Kelas / Wali Kelas 5',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    nipNisn: '19920410 201802 2 003'
  },
  {
    id: 'usr-siswa',
    name: 'Rizky Pratama Mukomuko',
    username: 'siswa',
    role: 'siswa',
    schoolId: 'sch-01',
    schoolName: 'SDN 05 Air Rami (3T Pesisir)',
    gradeLevel: 'Kelas 5 SD',
    nipNisn: 'NISN: 0129481923',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80'
  }
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-01',
    npsn: '10701823',
    name: 'SDN 05 Air Rami (3T Pesisir)',
    level: 'SD',
    district: 'Air Rami',
    address: 'Jl. Lintas Barat Sumatera Km. 82, Desa Rami Mulya, Kec. Air Rami, Kab. Mukomuko',
    headmasterName: 'Sri Wahyuni, S.Pd., M.M.',
    electricStatus: 'PLN Terbatas',
    internetStatus: 'Terbatas (3G/4G Lemah)',
    deviceCount: 6,
    studentCount: 142,
    teacherCount: 9,
    literacyScoreAvg: 58.4,
    numeracyScoreAvg: 49.2,
    priorityLevel: 'Tinggi',
    is3TArea: true,
    notes: 'Kerap mati lampu saat hujan deras. Perlu media pembelajaran offline-first.',
    updatedAt: '2026-03-12'
  },
  {
    id: 'sch-02',
    npsn: '10702190',
    name: 'SDN 12 Teramang Jaya',
    level: 'SD',
    district: 'Teramang Jaya',
    address: 'Desa Bunga Tanjung, Kec. Teramang Jaya, Kab. Mukomuko',
    headmasterName: 'Baharuddin, S.Pd.',
    electricStatus: 'Genset/Surya',
    internetStatus: 'VSAT/Satelit',
    deviceCount: 3,
    studentCount: 88,
    teacherCount: 7,
    literacyScoreAvg: 46.8,
    numeracyScoreAvg: 41.5,
    priorityLevel: 'Sangat Tinggi',
    is3TArea: true,
    notes: 'Akses jalan tanah perkebunan sawit. Internet hanya via VSAT BAKTI Kominfo.',
    updatedAt: '2026-03-10'
  },
  {
    id: 'sch-03',
    npsn: '10701104',
    name: 'SMPN 02 Penarik',
    level: 'SMP',
    district: 'Penarik',
    address: 'Jl. Merdeka Desa Lubuk Mukti, Kec. Penarik, Kab. Mukomuko',
    headmasterName: 'H. Sudarsono, M.Pd.',
    electricStatus: 'PLN 24 Jam',
    internetStatus: 'Stabil (Fiber/4G)',
    deviceCount: 24,
    studentCount: 260,
    teacherCount: 18,
    literacyScoreAvg: 74.2,
    numeracyScoreAvg: 68.9,
    priorityLevel: 'Sedang',
    is3TArea: false,
    notes: 'Pusat rujukan MGMP wilayah tengah Mukomuko dengan laboratorium komputer memadai.',
    updatedAt: '2026-03-11'
  },
  {
    id: 'sch-04',
    npsn: '10702441',
    name: 'SMPN 04 Ipuh Perbatasan',
    level: 'SMP',
    district: 'Ipuh',
    address: 'Desa Medan Jaya, Kec. Ipuh, Kab. Mukomuko',
    headmasterName: 'Dewi Kartika, S.Si., M.Pd.',
    electricStatus: 'PLN Terbatas',
    internetStatus: 'Terbatas (3G/4G Lemah)',
    deviceCount: 12,
    studentCount: 175,
    teacherCount: 14,
    literacyScoreAvg: 62.5,
    numeracyScoreAvg: 54.1,
    priorityLevel: 'Tinggi',
    is3TArea: true,
    notes: 'Jaringan seluler fluktuatif, bergantung pada pasokan listrik BTS.',
    updatedAt: '2026-03-08'
  },
  {
    id: 'sch-05',
    npsn: '10700981',
    name: 'SDN 01 Kota Mukomuko',
    level: 'SD',
    district: 'Kota Mukomuko',
    address: 'Jl. Fatmawati No. 14, Pasar Mukomuko, Kec. Kota Mukomuko',
    headmasterName: 'Dra. Hj. Nurlela, M.Pd.',
    electricStatus: 'PLN 24 Jam',
    internetStatus: 'Stabil (Fiber/4G)',
    deviceCount: 30,
    studentCount: 380,
    teacherCount: 24,
    literacyScoreAvg: 82.6,
    numeracyScoreAvg: 79.8,
    priorityLevel: 'Rendah',
    is3TArea: false,
    notes: 'Sekolah rujukan pusat kabupaten dengan fasilitas TIK lengkap.',
    updatedAt: '2026-03-12'
  },
  {
    id: 'sch-06',
    npsn: '10702890',
    name: 'SDN 08 Malin Deman (Pedalaman)',
    level: 'SD',
    district: 'Malin Deman',
    address: 'Desa Serami Baru, Talang Arah, Kec. Malin Deman, Kab. Mukomuko',
    headmasterName: 'Mansyur Efendi, S.Pd.SD',
    electricStatus: 'Genset/Surya',
    internetStatus: 'Tidak Ada Sinyal',
    deviceCount: 2,
    studentCount: 54,
    teacherCount: 5,
    literacyScoreAvg: 39.5,
    numeracyScoreAvg: 34.0,
    priorityLevel: 'Sangat Tinggi',
    is3TArea: true,
    notes: 'Daerah terisolir pinggir kawasan hutan. Memerlukan sinkronisasi USB/Hub luring.',
    updatedAt: '2026-03-05'
  }
];

export const INITIAL_COMPETENCIES: Competency[] = [
  // LITERASI SD
  {
    id: 'comp-lit-sd-01',
    code: 'LIT.SD.01',
    domain: 'Literasi',
    level: 'SD',
    title: 'Menemukan Informasi Tersurat dalam Teks Narasi & Cerita Lokal',
    description: 'Kemampuan mengidentifikasi siapa, apa, kapan, di mana, dan mengapa dalam teks bacaan.',
    minMasteryScore: 70
  },
  {
    id: 'comp-lit-sd-02',
    code: 'LIT.SD.02',
    domain: 'Literasi',
    level: 'SD',
    title: 'Menyimpulkan Ide Pokok dan Pesan Moral Cerita',
    description: 'Kemampuan menarik amanat atau simpulan utama dari suatu bacaan atau fabel pendek.',
    minMasteryScore: 70
  },
  // NUMERASI SD
  {
    id: 'comp-num-sd-01',
    code: 'NUM.SD.01',
    domain: 'Numerasi',
    level: 'SD',
    title: 'Operasi Dasar Penjumlahan dan Pengurangan Pecahan',
    description: 'Kemampuan menyamakan penyebut dan melakukan operasi hitung pecahan biasa serta campuran.',
    minMasteryScore: 70
  },
  {
    id: 'comp-num-sd-02',
    code: 'NUM.SD.02',
    domain: 'Numerasi',
    level: 'SD',
    title: 'Penalaran Pengukuran dan Geometri Sehari-hari',
    description: 'Menghitung keliling, luas bangun datar, serta estimasi satuan dalam konteks kehidupan nyata.',
    minMasteryScore: 70
  },
  // LITERASI SMP
  {
    id: 'comp-lit-smp-01',
    code: 'LIT.SMP.01',
    domain: 'Literasi',
    level: 'SMP',
    title: 'Mengevaluasi Kredibilitas dan Opini dalam Teks Informasi',
    description: 'Menganalisis perbedaan fakta, data ilmiah, dan opini subjektif dalam artikel ilmiah populer.',
    minMasteryScore: 70
  },
  // NUMERASI SMP
  {
    id: 'comp-num-smp-01',
    code: 'NUM.SMP.01',
    domain: 'Numerasi',
    level: 'SMP',
    title: 'Aljabar dan Representasi Rasio Perbandingan',
    description: 'Memodelkan permasalahan perbandingan senilai dan berbalik nilai dalam konteks ekonomi lokal.',
    minMasteryScore: 70
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // NUM.SD.01 - Pecahan (Soal 1)
  {
    id: 'q-num-sd-01',
    competencyId: 'comp-num-sd-01',
    domain: 'Numerasi',
    level: 'SD',
    questionText: 'Ibu Rahma di Desa Air Rami membeli 1/2 kg gula pasir dan 1/4 kg tepung terigu untuk membuat kue tat khas Bengkulu. Berapa total berat belanjaan Ibu Rahma dalam bentuk pecahan kg?',
    options: [
      { key: 'A', text: '2/6 kg' },
      { key: 'B', text: '3/4 kg' },
      { key: 'C', text: '2/4 kg' },
      { key: 'D', text: '1/8 kg' }
    ],
    correctAnswer: 'B',
    explanation: 'Untuk menjumlahkan 1/2 + 1/4, samakan penyebutnya menjadi per-4: 1/2 = 2/4. Maka 2/4 + 1/4 = 3/4 kg.',
    difficulty: 'Mudah'
  },
  // NUM.SD.01 - Pecahan (Soal 2)
  {
    id: 'q-num-sd-02',
    competencyId: 'comp-num-sd-01',
    domain: 'Numerasi',
    level: 'SD',
    questionText: 'Pak Budi memiliki sebidang kebun sawit. Sebanyak 2/3 bagian telah dipanen pada hari Senin dan 1/6 bagian dipanen pada hari Selasa. Berapa total bagian kebun sawit yang sudah dipanen?',
    options: [
      { key: 'A', text: '3/9 bagian' },
      { key: 'B', text: '4/6 bagian' },
      { key: 'C', text: '5/6 bagian' },
      { key: 'D', text: '1 bagian penuh' }
    ],
    correctAnswer: 'C',
    explanation: 'Samakan penyebut pecahan: 2/3 = 4/6. Jumlahkan: 4/6 + 1/6 = 5/6 bagian.',
    difficulty: 'Sedang'
  },
  // NUM.SD.01 - Pecahan (Soal 3)
  {
    id: 'q-num-sd-03',
    competencyId: 'comp-num-sd-01',
    domain: 'Numerasi',
    level: 'SD',
    questionText: 'Seorang nelayan di Mukomuko memiliki jaring ikan sepanjang 3/4 meter. Karena tersangkut karang, jaring dipotong sepanjang 1/2 meter. Berapa panjang sisa jaring ikan sekarang?',
    options: [
      { key: 'A', text: '1/4 meter' },
      { key: 'B', text: '2/2 meter' },
      { key: 'C', text: '1/2 meter' },
      { key: 'D', text: '2/4 meter' }
    ],
    correctAnswer: 'A',
    explanation: 'Samakan penyebut: 1/2 = 2/4. Maka 3/4 - 2/4 = 1/4 meter.',
    difficulty: 'Sedang'
  },
  // NUM.SD.02 - Geometri (Soal 4)
  {
    id: 'q-num-sd-04',
    competencyId: 'comp-num-sd-02',
    domain: 'Numerasi',
    level: 'SD',
    questionText: 'Halaman SDN 05 Air Rami berbentuk persegi panjang dengan panjang 20 meter dan lebar 15 meter. Berapa keliling halaman sekolah tersebut?',
    options: [
      { key: 'A', text: '35 meter' },
      { key: 'B', text: '70 meter' },
      { key: 'C', text: '300 meter' },
      { key: 'D', text: '60 meter' }
    ],
    correctAnswer: 'B',
    explanation: 'Keliling persegi panjang = 2 x (panjang + lebar) = 2 x (20 + 15) = 2 x 35 = 70 meter.',
    difficulty: 'Mudah'
  },
  // LIT.SD.01 - Literasi Informasi Tersurat (Soal 5)
  {
    id: 'q-lit-sd-01',
    competencyId: 'comp-lit-sd-01',
    domain: 'Literasi',
    level: 'SD',
    questionText: 'Bacalah teks singkat berikut:\n"Di pesisir Pantai Abrasi Mukomuko, para warga bergotong royong menanam 500 bibit pohon cemara laut setiap Sabtu pagi. Kegiatan ini dipimpin langsung oleh Pak Camat untuk menahan deburan ombak Samudra Hindia agar tidak merusak jalan lintas barat."\n\nKapan kegiatan penanaman pohon cemara laut dilaksanakan?',
    options: [
      { key: 'A', text: 'Setiap Minggu sore' },
      { key: 'B', text: 'Setiap Sabtu pagi' },
      { key: 'C', text: 'Setiap hari Jumat' },
      { key: 'D', text: 'Setiap awal bulan' }
    ],
    correctAnswer: 'B',
    explanation: 'Berdasarkan teks kalimat pertama, tertulis jelas bahwa kegiatan dilakukan "setiap Sabtu pagi".',
    difficulty: 'Mudah'
  },
  // LIT.SD.02 - Literasi Ide Pokok (Soal 6)
  {
    id: 'q-lit-sd-02',
    competencyId: 'comp-lit-sd-02',
    domain: 'Literasi',
    level: 'SD',
    questionText: 'Apa pesan moral utama dari kegiatan penanaman pohon cemara laut di Pantai Abrasi Mukomuko pada cerita di atas?',
    options: [
      { key: 'A', text: 'Menebang pohon di pesisir menguntungkan' },
      { key: 'B', text: 'Kepedulian dan kerja sama menjaga lingkungan pesisir dapat mencegah bencana alam' },
      { key: 'C', text: 'Pantai hanya boleh dikunjungi pejabat' },
      { key: 'D', text: 'Jalan raya tidak memerlukan perawatan warga' }
    ],
    correctAnswer: 'B',
    explanation: 'Pesan moral cerita adalah semangat kebersamaan (gotong royong) dalam merawat alam demi perlindungan sarana publik dari bahaya abrasi.',
    difficulty: 'Sedang'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-num-01',
    title: 'Operasi Pecahan Dasar: Menyamakan Penyebut dengan KPK',
    domain: 'Numerasi',
    level: 'SD',
    competencyId: 'comp-num-sd-01',
    competencyName: 'Operasi Dasar Penjumlahan dan Pengurangan Pecahan',
    description: 'Modul ringkas interaktif cara mudah menyamakan penyebut pecahan melalui ilustrasi kue tradisional Bengkulu dan KPK.',
    readingTimeMinutes: 7,
    isDownloadedOffline: true,
    downloadedAt: '2026-03-12T08:00:00Z',
    fileSizeBytes: 420000,
    recommendedForWeakCompetency: true,
    content: `# Operasi Penjumlahan & Pengurangan Pecahan

Selamat datang di materi penguatan numerasi JALIN-TUNTAS!

### Konsep Inti
Pecahan menyatakan bagian dari keseluruhan.
- Angka di atas disebut **Pembilang** (menunjukkan berapa bagian yang kita miliki).
- Angka di bawah disebut **Penyebut** (menunjukkan berapa bagian total pemotongan).

### Aturan Emas:
> **Pecahan HANYA bisa dijumlahkan atau dikurangkan jika PENYEBUTNYA SAMA!**

### Contoh Kasus Sehari-hari:
Bayangkan satu loyang **Kue Tat Khas Mukomuko**:
- Sepotong berukuran 1/2 loyang.
- Sepotong lain berukuran 1/4 loyang.
Bagaimana menggabungkannya?
1. Samakan penyebut dengan mencari KPK dari 2 dan 4, yaitu **4**.
2. Ubah 1/2 menjadi pecahan senilai: (1 x 2) / (2 x 2) = **2/4**.
3. Sekarang jumlahkan pembilangnya: **2/4 + 1/4 = 3/4** loyang!

### Rumus Kilat:
$$a/b + c/d = (a.d + b.c) / (b.d)$$

Kerjakan latihan mandiri setelah membaca modul ini untuk mengunci pemahamanmu!`
  },
  {
    id: 'mat-num-02',
    title: 'Geometri Kontekstual: Menghitung Keliling dan Luas Lahan',
    domain: 'Numerasi',
    level: 'SD',
    competencyId: 'comp-num-sd-02',
    competencyName: 'Penalaran Pengukuran dan Geometri Sehari-hari',
    description: 'Panduan visual menghitung batas kebun sawit dan lapangan sekolah menggunakan konsep keliling dan luas.',
    readingTimeMinutes: 6,
    isDownloadedOffline: true,
    downloadedAt: '2026-03-12T08:00:00Z',
    fileSizeBytes: 310000,
    content: `# Menghitung Keliling dan Luas Bidang Datar

Modul ini membantu siswa memahami perbedaan mendasar antara **Keliling** (panjang pagar keliling) dan **Luas** (seluruh permukaan tanah).

### 1. Keliling Persegi Panjang
Keliling adalah jumlah panjang seluruh sisi tepi luar.
- **Rumus:** Keliling = 2 x (Panjang + Lebar)
- **Contoh:** Halaman berukuran panjang 20m dan lebar 15m.
  Keliling = 2 x (20 + 15) = 2 x 35 = **70 meter**.

### 2. Luas Persegi Panjang
Luas adalah besaran ruang datar di dalam batas tersebut.
- **Rumus:** Luas = Panjang x Lebar
- **Contoh:** Luas = 20 x 15 = **300 meter persegi** ($m^2$).`
  },
  {
    id: 'mat-lit-01',
    title: 'Teknik Menemukan Kata Kunci (5W + 1H) dalam Cerita Lokal',
    domain: 'Literasi',
    level: 'SD',
    competencyId: 'comp-lit-sd-01',
    competencyName: 'Menemukan Informasi Tersurat dalam Teks Narasi',
    description: 'Metode detektif membaca cerdas untuk menemukan jawaban langsung di dalam teks cerita.',
    readingTimeMinutes: 5,
    isDownloadedOffline: false,
    fileSizeBytes: 280000,
    content: `# Menemukan Informasi Tersurat dengan Rumus ADiKSiMBa

Ketika membaca teks atau cerita narasi, gunakan metode **ADiKSiMBa**:
- **A**pa (Peristiwa apa yang terjadi?)
- **Di** mana (Lokasi kejadian?)
- **K**apan (Waktu terjadinya?)
- **Si**apa (Pelaku atau tokoh yang terlibat?)
- **M**engapa (Alasan penyebab peristiwa?)
- **Ba**gaimana (Proses jalannya cerita?)

Informasi tersurat berarti kata kuncinya tertulis langsung di kalimat bacaan tanpa perlu ditebak!`
  },
  {
    id: 'mat-lit-02',
    title: 'Menangkap Pesan Moral & Amanat dalam Cerita Rakyat Bengkulu',
    domain: 'Literasi',
    level: 'SD',
    competencyId: 'comp-lit-sd-02',
    competencyName: 'Menyimpulkan Ide Pokok dan Pesan Moral Cerita',
    description: 'Cara mengenali nasihat hidup, nilai gotong royong, dan karakter terpuji dari cerita rakyat.',
    readingTimeMinutes: 8,
    isDownloadedOffline: true,
    downloadedAt: '2026-03-12T09:15:00Z',
    fileSizeBytes: 390000,
    content: `# Menemukan Pesan Moral Cerita

Pesan moral atau amanat adalah nilai kebaikan yang ingin disampaikan oleh pengarang kepada pembaca.

### Tanda-tanda Pesan Moral:
1. Perhatikan akibat dari perbuatan tokoh (apakah tokoh jujur beruntung? apakah tokoh sombong celaka?)
2. Renungkan apa yang dapat ditiru dalam kehidupan sehari-hari di rumah dan sekolah.
3. Hubungkan dengan nilai kearifan lokal seperti tolong-menolong, menghormati orang tua, dan menjaga alam sekitar.`
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-01',
    title: 'Asesmen Diagnostik Awal Semester: Numerasi & Literasi Dasar Kelas 5',
    domain: 'Numerasi',
    level: 'SD',
    targetGrade: 'Kelas 5 SD',
    teacherId: 'usr-guru',
    teacherName: 'Siti Rahmawati, S.Pd.',
    schoolId: 'sch-01',
    durationMinutes: 20,
    questionIds: ['q-num-sd-01', 'q-num-sd-02', 'q-num-sd-03', 'q-num-sd-04', 'q-lit-sd-01', 'q-lit-sd-02'],
    competencyIds: ['comp-num-sd-01', 'comp-num-sd-02', 'comp-lit-sd-01', 'comp-lit-sd-02'],
    createdAt: '2026-03-10',
    status: 'Aktif'
  }
];

export const INITIAL_BEST_PRACTICES: BestPracticePost[] = [
  {
    id: 'bp-01',
    authorName: 'Ahmad Fauzi, M.Pd.',
    authorRole: 'Guru Koordinator Wilayah',
    schoolName: 'SDN 05 Air Rami',
    title: 'Pemanfaatan Kartu Pecahan Kontekstual Buah Sawit Saat Sinyal Padam',
    category: 'Numerasi Kontekstual',
    content: 'Di daerah kami sinyal listrik sering padam saat petir. Kami mengkombinasikan materi JALIN-TUNTAS yang diunduh luring dengan alat peraga manipulatif tandan buah sawit tiruan dari karton untuk mengajarkan konsep pecahan senilai. Siswa sangat antusias dan retensi konsep pecahan naik 35%!',
    likes: 28,
    createdAt: '2026-03-11'
  },
  {
    id: 'bp-02',
    authorName: 'Siti Rahmawati, S.Pd.',
    authorRole: 'Guru Kelas 5',
    schoolName: 'SDN 05 Air Rami',
    title: 'Strategi 15 Menit Pojok Baca Cerita Pesisir Sebelum Belajar',
    category: 'Literasi Kelas Rendah',
    content: 'Membiasakan murid membaca modul luring JALIN-HUB berisi cerita fabel kearifan lokal Mukomuko selama 15 menit setiap awal pelajaran terbukti melipatgandakan kosakata dan keberanian siswa berbicara di depan kelas.',
    likes: 19,
    createdAt: '2026-03-09'
  }
];

export const INITIAL_MENTORING_NOTES: MentoringNote[] = [
  {
    id: 'mn-01',
    teacherId: 'usr-guru',
    teacherName: 'Siti Rahmawati, S.Pd.',
    schoolName: 'SDN 05 Air Rami',
    date: '2026-03-11',
    focusArea: 'Penguatan Remedial Operasi Pecahan Siswa Kelompok Bawah',
    studentProgressObserved: '6 dari 10 siswa yang awalnya kesulitan menyamakan penyebut kini sudah berhasil setelah diberikan modul adaptif pecahan dasar.',
    actionPlan: 'Lanjutkan asesmen formatif berkala luring dan berikan apresiasi lencana pada siswa dengan peningkatan skor tertinggi.'
  }
];

