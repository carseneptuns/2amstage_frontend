# Foto Hero (kolase strip vertikal)

Folder ini isinya foto-foto yang dipakai buat background hero
(bagian "LIVE TILL 2AM") di `src/components/home/Hero.jsx`.

Sekarang isinya cuma placeholder abu-abu bernomor (01.jpg – 16.jpg)
supaya layout-nya bisa langsung dicoba. Tinggal timpa file-file ini
dengan foto kamu sendiri, pakai nama file yang sama persis
(01.jpg, 02.jpg, dst) — otomatis kepasang, gak perlu ubah kode.

Kalau mau ganti jumlah strip, urutan, atau warna tint-nya, edit
array `HERO_STRIPS` di bagian paling atas `Hero.jsx`. Tiap item:

- `src`  → path foto (relatif dari folder `public/`)
- `tint` → warna overlay duotone (hex). Isi `null` kalau mau foto
  tampil natural tanpa filter warna.

Rasio potret (tinggi > lebar) hasilnya paling bagus, karena tiap
foto ditampilkan sebagai strip vertikal yang mengisi tinggi penuh
hero section.
