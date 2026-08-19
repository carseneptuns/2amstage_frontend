# Foto Hero (kolase strip vertikal)

Folder ini isinya foto-foto yang dipakai buat background hero
(bagian "LIVE TILL 2AM") di `src/components/home/Hero.jsx`.

Sekarang isinya cuma placeholder abu-abu bernomor (01.jpg – 06.jpg)
supaya layout-nya bisa langsung dicoba. Tinggal timpa file-file ini
dengan foto kamu sendiri, pakai nama file yang sama persis
(01.jpg, 02.jpg, dst) — otomatis kepasang, gak perlu ubah kode.

Fotonya tampil natural, tanpa filter warna apa pun.

Kalau mau ganti jumlah strip atau urutannya, edit array
`HERO_STRIPS` di bagian paling atas `Hero.jsx` — tinggal
tambah/hapus baris `{ src: "/images/hero/xx.jpg" }`.

Rasio potret (tinggi > lebar) hasilnya paling bagus, karena tiap
foto ditampilkan sebagai strip vertikal yang mengisi tinggi penuh
hero section.
