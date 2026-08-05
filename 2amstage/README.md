# 2AMSTAGE — Frontend

Landing page & ticketing flow untuk **2AMSTAGE**, dibangun dengan React + Vite +
Tailwind, terhubung langsung ke backend Flask yang kamu lampirkan
(`2amstage_backend`).

## Menjalankan secara lokal

**1. Jalankan backend Flask-mu terlebih dahulu** (di repo `2amstage_backend`):

```bash
pip install -r requirements.txt
python run.py
```

Backend akan jalan di `http://localhost:5000`. CORS di backend sudah
dikonfigurasi untuk menerima origin `http://localhost:5173` (default port
Vite), jadi tidak perlu diubah.

**2. Jalankan frontend ini:**

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Base URL API diatur lewat `.env` (`VITE_API_BASE_URL`, default
`http://localhost:5000`). Ubah kalau backend kamu jalan di host/port lain.

## Struktur

```
src/
  components/
    layout/     Navbar, Footer, ProtectedRoute, PageTransition
    home/       Hero, ConcertShowcase, ServiceOverview, AboutUs, ConcertCard
    concert/    SeatmapZones (pemilih zona/kategori tiket)
    ticket/     QRTicket (kartu tiket premium)
    ui/         Reveal, CountdownTimer, TicketStub, PosterFrame, LoadingScreen
  pages/        Home, Login, Register, ConcertDetail, Checkout, MyTickets, NotFound
  hooks/        useEvents, useEvent, useCountdown
  store/        authStore (zustand, persisted ke localStorage)
  lib/api.js    axios instance + interceptor JWT
  utils/        format.js (IDR/tanggal), ticketCache.js (lihat catatan di bawah)
```

## Keputusan desain & asumsi penting

Beberapa bagian frontend disesuaikan dengan apa yang **benar-benar tersedia**
di backend kamu — bukan diasumsikan begitu saja:

- **Seatmap = pemilihan zona per kategori tiket, bukan kursi bernomor.**
  Backend hanya menyimpan kuota per `ticket_category` (tidak ada tabel kursi
  individual), jadi peta kursi dibuat sebagai visual zona interaktif dengan
  indikator ketersediaan real-time berbasis `sisa_kuota`. Ini paling jujur
  terhadap kapasitas API yang ada.

- **Registrasi selalu membuat akun `customer`.** Field `role` sengaja tidak
  dikirim dari form publik, backend akan default ke `customer`. Role lain
  (`organizer`, `petugas`, `super_admin`) dianggap dibuat lewat jalur admin,
  bukan form publik.

- **Halaman Checkout mengandalkan data order dari hasil `POST /orders`**
  (dikirim lewat router state), karena backend tidak punya endpoint
  `GET /orders/:id`. Kalau halaman checkout dibuka langsung tanpa state
  (misalnya refresh), frontend fallback ke `GET /orders/my` untuk status
  dasar order.

- **`utils/ticketCache.js`** menyimpan pemetaan `order_id → ticket_code[]` di
  localStorage tepat setelah pembayaran sukses. Ini diperlukan karena
  `GET /tickets/my` mengembalikan tiket secara flat (tanpa info event/kategori
  per tiket) dan tidak ada endpoint untuk menautkan `order_detail_id` balik ke
  event. Tiket yang dibeli di sesi/browser yang sama akan tampil dikelompokkan
  rapi per konser di halaman **Tiket Saya**; tiket dari sesi lain tetap
  muncul (status & QR tetap valid dari API), hanya ditampilkan di bagian
  "Tiket Lainnya" tanpa detail poster/nama event.

- **Metode pembayaran di Checkout adalah simulasi visual** (QRIS / VA /
  E-Wallet) — backend tidak mengintegrasikan payment gateway, jadi tombol
  "Bayar" langsung memanggil `POST /orders/:id/pay` yang menandai order
  `paid` dan menerbitkan tiket. Kalau kamu nanti mengintegrasikan payment
  gateway sungguhan, ganti pemanggilan ini di `src/pages/Checkout.jsx`.

- Gambar poster memakai `poster_url` dari backend (disajikan lewat
  `/static/uploads/...`). Kalau event belum punya poster, ditampilkan
  gradient placeholder bertema panggung — tidak memakai stok foto eksternal.

## Build untuk produksi

```bash
npm run build
```

Output ada di `dist/`. Sesuaikan `VITE_API_BASE_URL` di `.env` sebelum build
kalau backend produksi punya domain berbeda.
